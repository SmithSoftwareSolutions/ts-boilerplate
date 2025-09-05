/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthenticatedPayload } from '@org/nest/auth';
import { BaseResourceTypeMappings } from '../types/base-resource-type-mapping.type';
import { getResourcePrimaryKeyName } from '@org/ts/common';
import { PaginatedResponse } from '../types/paginated-response.type';
import { PaginationData } from '../types/pagination-data.type';
import { PrismaClient } from '@prisma/client';

export const DEFAULT_PAGE_SIZE = 25;

export class BaseResourceService<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>
> {
  protected unscopedPrisma: PrismaClient;
  protected get prisma() {
    return (this.unscopedPrisma as any)[this.modelName];
  }

  protected dataToSeed: ResourceTypeMappings['createT'][] = [];
  protected toSeedUniqueConstraint?: (
    toCreate: ResourceTypeMappings['createT']
  ) => ResourceTypeMappings['whereT'];

  protected ignoreIncludeOnUpdateKeys: string[] = [];

  constructor(
    private readonly modelName: string,
    protected compositeKeyOrder?: any[],
    protected parentResourceType?: string,
    protected getParentResourceId?: (
      data: ResourceTypeMappings['resourceWithRelationsT']
    ) => number,
    protected readonly includeForOne?: ResourceTypeMappings['includeT'],
    protected readonly includeForMany?: ResourceTypeMappings['includeT']
  ) {
    // TODO: remove any and fix omit issue
    this.unscopedPrisma = new PrismaClient({
      omit: {
        user: {
          passwordHash: true,
          passwordResetToken: true,
        },
      },
    } as any);
  }

  async create<RT = ResourceTypeMappings['resourceT']>(
    data: ResourceTypeMappings['createT'],
    userPayload?: AuthenticatedPayload
  ): Promise<RT> {
    const created = await this.prisma.create({ data });
    await this.logAction(
      {
        resourceId: created[getResourcePrimaryKeyName(this.compositeKeyOrder)],
        resourceType: this.modelName,
        didCreateResource: true,
        payload: data,
        parentResourceType: this.parentResourceType,
        parentResourceId: this.getParentResourceId
          ? this.getParentResourceId(created)
          : undefined,
      },
      userPayload
    );
    return this.mapResource ? await this.mapResource(created) : created;
  }

  async createMany<RT = ResourceTypeMappings['resourceT']>(
    data: ResourceTypeMappings['createT'][],
    userPayload?: AuthenticatedPayload
  ): Promise<RT[]> {
    const created = await this.prisma.createMany({ data });
    return this.mapResources ? await this.mapResources(created) : created;
  }

  async get<RT = ResourceTypeMappings['resourceWithRelationsT']>(
    where: ResourceTypeMappings['whereUniqueT'] = {} as any,
    overrideInclude?: ResourceTypeMappings['includeT']
  ): Promise<RT> {
    const data = await this.prisma.findUnique({
      where,
      include: overrideInclude ?? this.includeForOne,
    });
    return this.mapResource ? await this.mapResource(data) : data;
  }

  async getMany<RT = ResourceTypeMappings['resourceWithRelationsT']>(
    where: ResourceTypeMappings['whereT'] = {} as any,
    overrideInclude?: ResourceTypeMappings['includeT'],
    pagination?: PaginationData<ResourceTypeMappings['resourceT']>
  ): Promise<PaginatedResponse<RT>> {
    const page: number | undefined =
      pagination?.page ?? (pagination?.pageSize ? 1 : undefined);
    const pageSize: number | undefined = page
      ? pagination?.pageSize || DEFAULT_PAGE_SIZE
      : undefined;
    const skip: number | undefined = page ? pageSize! * (page - 1) : undefined;

    const [data, total] = await this.unscopedPrisma.$transaction([
      this.prisma.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: pagination?.orderBy,
        include: overrideInclude ?? this.includeForMany,
      }),
      this.prisma.count({ where }),
    ]);

    return {
      data: this.mapResources ? await this.mapResources(data) : data,
      metadata: {
        total,
        page: page,
        pageSize,
        pages: page ? Math.ceil(total / pageSize!) : undefined,
        orderBy: pagination?.orderBy,
      },
    };
  }

  async update<RT>(
    where: ResourceTypeMappings['whereUniqueT'],
    data: ResourceTypeMappings['updateT'],
    userPayload?: AuthenticatedPayload,
    ignoreRelationsInActionLog = false
  ): Promise<RT> {
    const include = ignoreRelationsInActionLog
      ? {}
      : Object.keys(data)
          .filter(
            (key) =>
              key.includes('Id') &&
              !this.ignoreIncludeOnUpdateKeys.includes(key)
          )
          .map((key) => key.replace('Id', ''))
          .reduce((includes, key) => ({ ...includes, [key]: true }), {} as any);

    const updated = await this.prisma.update({
      where,
      data,
      include,
    });

    const logPayload = { data, effects: {} as any };
    for (const [key, value] of Object.entries(data)) {
      if (key.includes('Id')) {
        const relationshipKey = key.replace('Id', '');
        if (Object.keys(updated).includes(relationshipKey)) {
          logPayload.effects[relationshipKey] = updated[relationshipKey];
        }
      }
    }

    await this.logAction(
      {
        resourceId: updated[getResourcePrimaryKeyName(this.compositeKeyOrder)],
        resourceType: this.modelName,
        didUpdateResource: true,
        payload: logPayload,
        parentResourceType: this.parentResourceType,
        parentResourceId: this.getParentResourceId
          ? this.getParentResourceId(updated)
          : undefined,
      },
      userPayload
    );

    return this.mapResource ? await this.mapResource(updated) : updated;
  }

  async updateMany<RT = ResourceTypeMappings['resourceT']>(
    where: ResourceTypeMappings['whereT'],
    data: ResourceTypeMappings['updateT'],
    userPayload?: AuthenticatedPayload
  ): Promise<RT[]> {
    const updated = await this.prisma.updateMany({
      where,
      data,
    });
    return this.mapResources ? await this.mapResources(updated) : updated;
  }

  async delete(
    where: ResourceTypeMappings['whereUniqueT'],
    userPayload?: AuthenticatedPayload
  ) {
    const deleted = await this.prisma.delete({
      where,
    });

    await this.logAction(
      {
        resourceId: deleted[getResourcePrimaryKeyName(this.compositeKeyOrder)],
        resourceType: this.modelName,
        didDeleteResource: true,
        payload: deleted,
        parentResourceType: this.parentResourceType,
        parentResourceId: this.getParentResourceId
          ? this.getParentResourceId(deleted)
          : undefined,
      },
      userPayload
    );

    return deleted;
  }

  async deleteMany(
    where: ResourceTypeMappings['whereT'],
    userPayload?: AuthenticatedPayload
  ) {
    const deleted = await this.prisma.deleteMany({
      where,
    });

    return deleted;
  }

  async seed() {
    for (const createT of this.dataToSeed) {
      if (this.toSeedUniqueConstraint) {
        const exists =
          (await this.getMany(this.toSeedUniqueConstraint(createT)))?.data
            ?.length > 0;
        if (exists) continue;
      }
      await this.create(createT);
    }
  }

  protected mapResource?: (
    data?: ResourceTypeMappings['resourceWithRelationsT'] | null
  ) => Promise<ResourceTypeMappings['resourceWithRelationsT']>;
  protected mapResources?: (
    data: ResourceTypeMappings['resourceWithRelationsT'][]
  ) => Promise<ResourceTypeMappings['resourceWithRelationsT'][]> = async (
    data: ResourceTypeMappings['resourceWithRelationsT'][]
  ) => {
    if (this.mapResource) {
      const mappedData = [];
      for (const item of data) {
        mappedData.push(await this.mapResource(item));
      }
      return mappedData;
    }
    return data;
  };

  protected async logAction(
    // data: Partial<Prisma.ActionLogUncheckedCreateInput>,
    data: Partial<any>,
    userPayload?: AuthenticatedPayload
  ) {
    // TODO: implement log logic
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  AuthGuard,
  FastifyRequestWithUser,
  Roles,
  USER_ROLE,
} from '@org/nest/auth';
import { AuthorizedRoles } from '../types/authorized-roles.type';
import { BaseError } from '../errors/base.error';
import { BaseResourceService } from '../services/base-resource.service';
import { BaseResourceTypeMappings } from '../types/base-resource-type-mapping.type';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  Type,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CompositeKeyConfig } from '../types/composite-key-config.type';
import { FindManyDTO } from '../dto/find-many.dto';
import { FindOneDTO } from '../dto/find-one.dto';
import { getResourcePrimaryKeyName } from '@org/ts/common';
import { InternalValidationError } from '../errors/internal-validation.error';
import { PaginationData } from '../types/pagination-data.type';
import {
  CanCreateFunctionT,
  CanReadFunctionT,
  CanUpdateFunctionT,
  CanDeleteFunctionT,
} from '../types/permission-function.types';

export interface IBaseResourceController<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>,
  FindOneQueryDTO extends FindOneDTO<
    ResourceTypeMappings['includeT']
  > = FindOneDTO<ResourceTypeMappings['includeT']>,
  FindManyQueryDTO extends FindManyDTO<
    ResourceTypeMappings['whereT']
  > = FindManyDTO<ResourceTypeMappings['whereT']>
> {
  create(
    req: FastifyRequestWithUser,
    body: ResourceTypeMappings['createDTO']
  ): any;
  getOne(
    req: FastifyRequestWithUser,
    id: ResourceTypeMappings['resourcePrimaryKeyT'],
    query: FindOneQueryDTO
  ): any;
  getMany(
    req: FastifyRequestWithUser,
    query: FindManyQueryDTO,
    request: FastifyRequestWithUser
  ): any;
  updateOne(
    req: FastifyRequestWithUser,
    params: string[],
    updates: ResourceTypeMappings['updateDTO']
  ): any;
  delete(req: FastifyRequestWithUser, params: string[]): any;

  canCreate?: CanCreateFunctionT<ResourceTypeMappings>;
  canRead?: CanReadFunctionT<ResourceTypeMappings>;
  canUpdate?: CanUpdateFunctionT<ResourceTypeMappings>;
  canDelete?: CanDeleteFunctionT<ResourceTypeMappings>;
}

export type AllowedIncudes<T = any> = {
  [key in keyof T]?: boolean | AllowedIncudes<T[key]>;
};

export type RoleBasedAllowedIncludes<T = any> = {
  [roleId in USER_ROLE | -1]?: AllowedIncudes<T>;
};

export type AllowedWhere<T = any> = {
  [key in keyof T]?: boolean | AllowedWhere<T[key]>;
};

export type RoleBasedAllowedWhere<T = any> = {
  [roleId in USER_ROLE | -1]?: AllowedWhere<T>;
};

export type AllowedOrderBy<T = any> = {
  [key in keyof T]?: boolean | 'asc' | 'desc';
};

export type RoleBasedAllowedOrderBy<T = any> = {
  [roleId in USER_ROLE | -1]?: AllowedOrderBy<T>;
};

export function createBaseController<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>,
  FindOneQueryDTO extends FindOneDTO<
    ResourceTypeMappings['includeT']
  > = FindOneDTO<ResourceTypeMappings['includeT']>,
  FindManyQueryDTO extends FindManyDTO<
    ResourceTypeMappings['whereT'],
    ResourceTypeMappings['includeT'],
    ResourceTypeMappings['orderByT']
  > = FindManyDTO<
    ResourceTypeMappings['whereT'],
    ResourceTypeMappings['includeT'],
    ResourceTypeMappings['orderByT']
  >
>(
  createDTO: Type<ResourceTypeMappings['createDTO']>,
  updateDTO: Type<ResourceTypeMappings['updateDTO']>,
  findOneQueryDTO: Type<FindOneQueryDTO>,
  findManyQueryDTO: Type<FindManyQueryDTO>,
  roleBasedAllowedIncludes: RoleBasedAllowedIncludes = {},
  roleBasedAllowedWhere: RoleBasedAllowedWhere<
    ResourceTypeMappings['whereT']
  > = {},
  roleBasedAllowedOrderBy: RoleBasedAllowedOrderBy = {},
  queryOneTransformer?: (query: FindOneQueryDTO) => any,
  queryManyTransformer?: (query: FindManyQueryDTO) => any,
  authorizedRoles?: AuthorizedRoles,
  compositeKeyConfig: CompositeKeyConfig<
    ResourceTypeMappings['resourceT']
  > | null = null
): Type<
  IBaseResourceController<
    ResourceTypeMappings,
    FindOneQueryDTO,
    FindManyQueryDTO
  >
> {
  let colonSeparatedKeys = ':id';
  if (compositeKeyConfig != null)
    colonSeparatedKeys = compositeKeyConfig.properties
      .map((k) => `:${String(k)}`)
      .join('/');

  @Controller()
  @UseGuards(AuthGuard)
  class BaseResourceController {
    protected readonly service!: BaseResourceService<ResourceTypeMappings>;

    @Post()
    @UsePipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        expectedType: createDTO,
      })
    )
    @Roles(...(authorizedRoles?.create || []))
    async create(
      @Request() req: FastifyRequestWithUser,
      @Body() body: ResourceTypeMappings['createDTO']
    ): Promise<ResourceTypeMappings['resourceT']> {
      try {
        if (this.canCreate && !(await this.canCreate(req.user, body))) {
          throw new ForbiddenException('User cannot perform specified action');
        }
        const res = await this.service.create(
          body as unknown as ResourceTypeMappings['createDTO'],
          req.user
        );

        return res as any;
      } catch (e) {
        if (e instanceof BaseError) {
          throw e.toHttp();
        }

        throw e;
      }
    }

    @Get(colonSeparatedKeys)
    @Roles(...(authorizedRoles?.read || []))
    async getOne(
      @Request() req: FastifyRequestWithUser,
      @Param() params: any,
      @Query(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          transformOptions: { enableImplicitConversion: true },
          expectedType: findOneQueryDTO,
        })
      )
      query: FindOneQueryDTO
    ) {
      if (queryOneTransformer) {
        query = queryOneTransformer(query as any);
      }

      try {
        const id = this.transformPrimaryKey(params);
        if (query.include)
          this.verifyRoleBasedInclusionPermissions(
            query.include,
            req.user?.roles ?? []
          );

        const res = await this.service.get(
          {
            [this.getPrimaryKeyName()]: id,
          } as ResourceTypeMappings['whereUniqueT'],
          query.include as any
        );

        if (this.canRead && !(await this.canRead(req.user, res))) {
          throw new ForbiddenException('User cannot perform specified action');
        }

        return res;
      } catch (e) {
        if (e instanceof BaseError) {
          throw e.toHttp();
        }

        throw e;
      }
    }

    @Get()
    @Roles(...(authorizedRoles?.read || []))
    @UsePipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        expectedType: findManyQueryDTO,
      })
    )
    async getMany(
      @Request() req: FastifyRequestWithUser,
      @Query() query: FindManyQueryDTO,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      @Req() request: FastifyRequestWithUser
    ) {
      if (queryManyTransformer) {
        query = queryManyTransformer(query as any);
      }
      try {
        if (query.where)
          this.verifyRoleBasedWherePermissions(
            query.where,
            req.user?.roles ?? []
          );
        if (query.orderBy)
          this.verifyRoleBasedOrderByPermissions(
            query.orderBy,
            req.user?.roles ?? []
          );

        let pagination;
        let include;
        if (query.page || query.pageSize || query.orderBy) {
          pagination = {
            page: query?.page,
            pageSize: query?.pageSize,
            orderBy: query?.orderBy,
          };

          delete query.page;
          delete query.pageSize;
          delete query.orderBy;
        }
        if (query.include) {
          if (query.include)
            this.verifyRoleBasedInclusionPermissions(
              query.include,
              req.user?.roles ?? []
            );
          include = query.include;
          delete query.include;
        }

        const res = await this.service.getMany(
          query.where as unknown as ResourceTypeMappings['whereT'],
          include as unknown as ResourceTypeMappings['includeT'],
          pagination as PaginationData
        );

        if (this.canRead) {
          for (const item of res.data) {
            if (!(await this.canRead(req.user, item))) {
              throw new ForbiddenException(
                'User cannot perform specified action'
              );
            }
          }
        }

        return res;
      } catch (e) {
        if (e instanceof BaseError) {
          throw e.toHttp();
        }

        throw e;
      }
    }

    @Patch(colonSeparatedKeys)
    @Roles(...(authorizedRoles?.update || []))
    async updateOne(
      @Request() req: FastifyRequestWithUser,
      @Param() params: any,
      @Body(
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          transformOptions: { enableImplicitConversion: true },
          skipMissingProperties: true,
          expectedType: updateDTO,
        })
      )
      updates: ResourceTypeMappings['updateDTO']
    ) {
      try {
        const id = this.transformPrimaryKey(params);

        const existing = await this.service.get({
          [this.getPrimaryKeyName()]: id,
        } as ResourceTypeMappings['whereUniqueT']);

        if (
          this.canUpdate &&
          !(await this.canUpdate(req.user, existing, updates))
        ) {
          throw new ForbiddenException('User cannot perform specified action');
        }

        const res = await this.service.update(
          {
            [this.getPrimaryKeyName()]: id,
          } as ResourceTypeMappings['whereUniqueT'],
          updates as unknown as ResourceTypeMappings['updateDTO'],
          req.user
        );

        return res;
      } catch (e) {
        if (e instanceof BaseError) {
          throw e.toHttp();
        }

        throw e;
      }
    }

    @Delete(colonSeparatedKeys)
    @Roles(...(authorizedRoles?.delete || []))
    async delete(@Request() req: FastifyRequestWithUser, @Param() params: any) {
      try {
        const id = this.transformPrimaryKey(params);

        const item = await this.service.get({
          [this.getPrimaryKeyName()]: id,
        } as ResourceTypeMappings['whereUniqueT']);

        if (this.canDelete && !(await this.canDelete(req.user, item))) {
          throw new ForbiddenException('User cannot perform specified action');
        }

        const res = await this.service.delete(
          {
            [this.getPrimaryKeyName()]: id,
          } as ResourceTypeMappings['whereUniqueT'],
          req.user
        );
        return res;
      } catch (e) {
        if (e instanceof BaseError) {
          throw e.toHttp();
        }

        throw e;
      }
    }

    protected verifyRoleBasedInclusionPermissions(
      include: ResourceTypeMappings['includeT'],
      roleIds: USER_ROLE[],
      allowed: RoleBasedAllowedIncludes = roleBasedAllowedIncludes
    ) {
      const exceptions = [];
      for (const roleId of roleIds) {
        let pass = true;
        try {
          this.verifyInclusionPermissions(include, {
            ...allowed[roleId],
            ...allowed[-1],
          });
        } catch (e) {
          pass = false;
          exceptions.push(e);
        }

        if (pass) {
          return true;
        }
      }

      for (const exception of exceptions) throw exception;

      return false;
    }

    protected verifyInclusionPermissions(
      include: ResourceTypeMappings['includeT'],
      allowed: AllowedIncudes = roleBasedAllowedIncludes
    ) {
      for (const [relationshipKey, value] of Object.entries(include)) {
        if (
          typeof value !== 'object' &&
          allowed[relationshipKey] !== true &&
          typeof allowed[relationshipKey] !== 'object'
        ) {
          throw new ForbiddenException(
            `User is not allowed to perform API request with supplied inclusion: ${relationshipKey}`
          );
        } else if (
          value != undefined &&
          value != null &&
          typeof value === 'object' &&
          typeof allowed[relationshipKey] !== 'object'
        ) {
          throw new ForbiddenException(
            `User is not allowed to perform API request where supplied inclusion is nested: ${relationshipKey}`
          );
        } else if (
          typeof value === 'object' &&
          typeof allowed[relationshipKey] == 'object'
        ) {
          this.verifyInclusionPermissions(
            value,
            (allowed[relationshipKey] as unknown as AllowedIncudes) ?? {}
          );
        }
      }

      return true;
    }

    protected verifyRoleBasedWherePermissions(
      where: ResourceTypeMappings['whereT'],
      roleIds: USER_ROLE[],
      allowed: RoleBasedAllowedWhere = roleBasedAllowedWhere
    ) {
      const exceptions = [];
      for (const roleId of roleIds) {
        let pass = true;
        try {
          this.verifyWherePermissions(where, {
            ...allowed[roleId],
            ...allowed[-1],
          });
        } catch (e) {
          pass = false;
          exceptions.push(e);
        }

        if (pass) {
          return true;
        }
      }

      for (const exception of exceptions) throw exception;

      return false;
    }

    protected verifyWherePermissions(
      where: any,
      allowed: AllowedWhere = roleBasedAllowedWhere
    ) {
      for (const [propertyKey, value] of Object.entries(where)) {
        if (
          typeof value !== 'object' &&
          allowed[propertyKey] !== true &&
          typeof allowed[propertyKey] !== 'object'
        ) {
          throw new InternalValidationError(
            `User is not allowed to perform API request with supplied query property: ${propertyKey}`
          );
        } else if (Array.isArray(value)) {
          for (const item of value) {
            this.verifyWherePermissions(
              item,
              (allowed[propertyKey] as any)?.[0] ?? {}
            );
          }
        } else if (
          typeof value === 'object' &&
          typeof allowed[propertyKey] !== 'object'
        ) {
          throw new InternalValidationError(
            `User is not allowed to perform API request where supplied query property is nested: ${propertyKey}`
          );
        } else if (
          typeof value === 'object' &&
          typeof allowed[propertyKey] == 'object'
        ) {
          this.verifyWherePermissions(
            value,
            (allowed[propertyKey] as unknown as AllowedWhere) ?? {}
          );
        }
      }

      return true;
    }

    protected verifyRoleBasedOrderByPermissions(
      orderBy: ResourceTypeMappings['orderByT'],
      roleIds: USER_ROLE[],
      allowed: RoleBasedAllowedOrderBy = roleBasedAllowedOrderBy
    ) {
      const exceptions = [];
      for (const roleId of roleIds) {
        let pass = true;
        try {
          this.verifyOrderByPermissions(orderBy, {
            ...allowed[roleId],
            ...allowed[-1],
          });
        } catch (e) {
          pass = false;
          exceptions.push(e);
        }

        if (pass) {
          return true;
        }
      }

      for (const exception of exceptions) throw exception;

      return false;
    }

    protected verifyOrderByPermissions(
      orderBy: ResourceTypeMappings['orderByT'],
      allowed: AllowedOrderBy = {}
    ) {
      for (const [propertyKey, value] of Object.entries(orderBy)) {
        if (!allowed[propertyKey])
          throw new ForbiddenException(
            `User is not allowed to perform API request where order by is: ${propertyKey}`
          );
        if (allowed[propertyKey] != true && allowed[propertyKey] != value)
          throw new ForbiddenException(
            `User is not allowed to perform API request where order by is: ${propertyKey}: ${value}`
          );
      }

      return true;
    }

    protected getPrimaryKeyName() {
      return getResourcePrimaryKeyName(compositeKeyConfig?.properties);
    }

    protected getColonSeparatedKeys() {
      if (compositeKeyConfig == null) return ':id';

      return compositeKeyConfig.properties
        .map((k) => `:${String(k)}`)
        .join('/');
    }

    protected transformPrimaryKey(params: any) {
      if (
        compositeKeyConfig == null ||
        (compositeKeyConfig.properties.length == 1 &&
          compositeKeyConfig.properties[0] == 'id')
      ) {
        if (/^\d+$/.test(Object.values(params)[0] as unknown as string))
          return parseInt(Object.values(params)[0] as unknown as string);
        return Object.values(params)[0] as unknown as string;
      }

      const newKey: any = {};
      for (const key of compositeKeyConfig.properties) {
        newKey[key] = /^\d+$/.test(params[key])
          ? parseInt(params[key])
          : params[key];
      }
      return newKey;
    }

    canCreate?: CanCreateFunctionT<ResourceTypeMappings>;
    canRead?: CanReadFunctionT<ResourceTypeMappings>;
    canUpdate?: CanUpdateFunctionT<ResourceTypeMappings>;
    canDelete?: CanDeleteFunctionT<ResourceTypeMappings>;
  }

  return BaseResourceController;
}

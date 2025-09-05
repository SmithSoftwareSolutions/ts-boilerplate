// eslint-disable-next-line @nx/enforce-module-boundaries
import { BaseResourceService } from '@org/nest/common';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import {
  userCompositeKeyOrder,
  UserResourceTypeMappings,
} from './../types/user.resource-type-mappings';

// @org:gen-ignore

@Injectable()
export class UserService extends BaseResourceService<UserResourceTypeMappings> {
  override get prisma() {
    return this.unscopedPrisma.user;
  }

  constructor() {
    super('user', userCompositeKeyOrder);
  }

  override async get<RT = UserResourceTypeMappings['resourceWithRelationsT']>(
    where: Prisma.UserWhereUniqueInput = {} as unknown as Prisma.UserWhereUniqueInput,
    overrideInclude?: Prisma.UserInclude,
    safe = false
  ): Promise<RT> {
    const user = await this.prisma.findUnique({
      where,
      omit: {
        passwordHash: false,
        passwordResetToken: false,
      },
      include: overrideInclude ?? this.includeForOne,
    });

    if (!safe && user?.passwordHash) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete user.passwordHash;
    }
    if (!safe && user?.passwordResetToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete user.passwordResetToken;
    }

    return (
      this.mapResource ? await this.mapResource(user as any) : user
    ) as RT;
  }

  protected override mapResources = async (data: User[]) =>
    data.map(
      (user) => ({ ...user, passwordHash: undefined } as unknown as User)
    );
}

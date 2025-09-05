// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  BaseResourceTypeMappings,
  MapPossibleIncludesToRequiredDepth,
} from '@org/nest/common';
import { CreateUserDTO } from '../dto/user/create-user.dto';
import { Prisma, User } from '@prisma/client';
import { QueryUserDTO } from '../dto/user/query-user.dto';
import { UpdateUserDTO } from '../dto/user/update-user.dto';
import { XOR } from '@org/ts/common';

export type UserResourceTypeMappings = BaseResourceTypeMappings<
  User,
  User &
    Exclude<
      Partial<
        Prisma.UserGetPayload<{
          include: MapPossibleIncludesToRequiredDepth<Prisma.UserInclude, 4>;
        }>
      >,
      User
    >,
  number,
  XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>,
  XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>,
  Prisma.UserWhereInput,
  Prisma.UserWhereUniqueInput,
  Prisma.UserInclude,
  Prisma.UserOrderByWithRelationInput,
  CreateUserDTO,
  UpdateUserDTO,
  QueryUserDTO
>;

export const userCompositeKeyOrder: (keyof UserResourceTypeMappings['resourceT'])[] =
  ['id'];

import { RefreshToken, Prisma } from '@prisma/client';
import { CreateRefreshTokenDTO } from './dto/create-refresh-token.dto';
import { UpdateRefreshTokenDTO } from './dto/update-refresh-token.dto';
import { QueryRefreshTokenDTO } from './dto/query-refresh-token.dto';

import {
  BaseResourceTypeMappings,
  MapPossibleIncludesToRequiredDepth,
} from '@org/nest/common';
import { XOR } from '@org/ts/common';

export type RefreshTokenResourceTypeMappings = BaseResourceTypeMappings<
  RefreshToken,
  RefreshToken &
    Exclude<
      Partial<
        Prisma.RefreshTokenGetPayload<{
          include: MapPossibleIncludesToRequiredDepth<
            Prisma.RefreshTokenInclude,
            4
          >;
        }>
      >,
      RefreshToken
    >,
  number,
  XOR<Prisma.RefreshTokenCreateInput, Prisma.RefreshTokenUncheckedCreateInput>,
  XOR<Prisma.RefreshTokenUpdateInput, Prisma.RefreshTokenUncheckedUpdateInput>,
  Prisma.RefreshTokenWhereInput,
  Prisma.RefreshTokenWhereUniqueInput,
  Prisma.RefreshTokenInclude,
  Prisma.RefreshTokenOrderByWithRelationInput,
  CreateRefreshTokenDTO,
  UpdateRefreshTokenDTO,
  QueryRefreshTokenDTO
>;

export const refreshTokenCompositeKeyOrder: (keyof RefreshTokenResourceTypeMappings['resourceT'])[] =
  ['id'];

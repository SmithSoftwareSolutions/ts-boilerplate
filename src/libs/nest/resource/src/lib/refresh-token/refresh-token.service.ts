import { BaseResourceService } from '@org/nest/common';
import { RefreshToken, Prisma } from '@prisma/client';
import {
  RefreshTokenResourceTypeMappings,
  refreshTokenCompositeKeyOrder,
} from './refresh-token.resource-type-mappings';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenService extends BaseResourceService<RefreshTokenResourceTypeMappings> {
  override get prisma() {
    return this.unscopedPrisma.refreshToken;
  }

  constructor() {
    super('refreshToken', refreshTokenCompositeKeyOrder);
  }
}

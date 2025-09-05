import { RefreshTokenService } from './refresh-token.service';
import { Controller } from '@nestjs/common';
import { CreateRefreshTokenDTO } from './dto/create-refresh-token.dto';
import { QueryRefreshTokenDTO } from './dto/query-refresh-token.dto';
import { routePrefix } from '../config';
import { UpdateRefreshTokenDTO } from './dto/update-refresh-token.dto';
import { USER_ROLE } from '@org/nest/auth';
import {
  RoleBasedAllowedIncludes,
  FindOneDTO,
  AuthorizedRoles,
  createBaseController,
  RoleBasedAllowedWhere,
  RoleBasedAllowedOrderBy,
} from '@org/nest/common';
import { RefreshTokenResourceTypeMappings } from './refresh-token.resource-type-mappings';

const allowedIncludes: RoleBasedAllowedIncludes<
  RefreshTokenResourceTypeMappings['includeT']
> = {};

const allowedWhere: RoleBasedAllowedWhere<
  RefreshTokenResourceTypeMappings['whereT']
> = {};

const allowedOrderBy: RoleBasedAllowedOrderBy<
  RefreshTokenResourceTypeMappings['orderByT']
> = {};

const queryOneTransformer = (
  q: FindOneDTO<RefreshTokenResourceTypeMappings['includeT']>
) => q;
const queryManyTransformer = (q: QueryRefreshTokenDTO) => q;

const authorizedRoles: AuthorizedRoles = {
  create: [USER_ROLE.ADMIN],
  read: [USER_ROLE.ADMIN],
  update: [USER_ROLE.ADMIN],
  delete: [USER_ROLE.ADMIN],
};

@Controller(`${routePrefix}/refresh-tokens`)
export class RefreshTokenController extends createBaseController<RefreshTokenResourceTypeMappings>(
  CreateRefreshTokenDTO,
  UpdateRefreshTokenDTO,
  FindOneDTO<RefreshTokenResourceTypeMappings['includeT']>,
  QueryRefreshTokenDTO,
  allowedIncludes,
  allowedWhere,
  allowedOrderBy,
  queryOneTransformer,
  queryManyTransformer,
  authorizedRoles
) {
  constructor(protected readonly service: RefreshTokenService) {
    super();
  }
}

import {
  AuthorizedRoles,
  CanUpdateFunctionT,
  createBaseController,
  FindOneDTO,
  RoleBasedAllowedIncludes,
  RoleBasedAllowedOrderBy,
  RoleBasedAllowedWhere,
} from '@org/nest/common';
import { Controller } from '@nestjs/common';
import {
  CreateUserDTO,
  QueryUserDTO,
  UpdateUserDTO,
  USER_ROLE,
  UserResourceTypeMappings,
  UserService,
} from '@org/nest/auth';
import { routePrefix } from '../config';

// @org:gen-ignore

const allowedIncludes: RoleBasedAllowedIncludes<
  UserResourceTypeMappings['includeT']
> = {};

const allowedWhere: RoleBasedAllowedWhere<UserResourceTypeMappings['whereT']> =
  {};

const allowedOrderBy: RoleBasedAllowedOrderBy<
  UserResourceTypeMappings['orderByT']
> = {};

const queryOneTransformer = (
  q: FindOneDTO<UserResourceTypeMappings['includeT']>
) => q;
const queryManyTransformer = (q: QueryUserDTO) => q;

const authorizedRoles: AuthorizedRoles = {
  create: [USER_ROLE.ADMIN],
  read: [USER_ROLE.ADMIN],
  update: [USER_ROLE.ADMIN],
  delete: [USER_ROLE.ADMIN],
};
@Controller(`${routePrefix}/users`)
export class UserController extends createBaseController<UserResourceTypeMappings>(
  CreateUserDTO,
  UpdateUserDTO,
  FindOneDTO<UserResourceTypeMappings['includeT']>,
  QueryUserDTO,
  allowedIncludes,
  allowedWhere,
  allowedOrderBy,
  queryOneTransformer,
  queryManyTransformer,
  authorizedRoles
) {
  constructor(protected readonly service: UserService) {
    super();
  }

  override canUpdate?: CanUpdateFunctionT<UserResourceTypeMappings> = async (
    user,
    existing,
    data
  ) => user!.roles?.includes(USER_ROLE.ADMIN) || user!.userId == existing.id;
}

import { UserNoteService } from './user-note.service';
import { Controller } from '@nestjs/common';
import { CreateUserNoteDTO } from './dto/create-user-note.dto';
import { QueryUserNoteDTO } from './dto/query-user-note.dto';
import { routePrefix } from '../config';
import { UpdateUserNoteDTO } from './dto/update-user-note.dto';
import { USER_ROLE } from '@org/nest/auth';
import {
  RoleBasedAllowedIncludes,
  FindOneDTO,
  AuthorizedRoles,
  createBaseController,
  CanCreateFunctionT,
  CanDeleteFunctionT,
  CanUpdateFunctionT,
  CanReadFunctionT,
  RoleBasedAllowedWhere,
  RoleBasedAllowedOrderBy,
} from '@org/nest/common';
import { UserNoteResourceTypeMappings } from './user-note.resource-type-mappings';

// @org:gen-ignore

const allowedIncludes: RoleBasedAllowedIncludes<
  UserNoteResourceTypeMappings['includeT']
> = {};

const allowedWhere: RoleBasedAllowedWhere<
  UserNoteResourceTypeMappings['whereT']
> = {};

const allowedOrderBy: RoleBasedAllowedOrderBy<
  UserNoteResourceTypeMappings['orderByT']
> = {};

const queryOneTransformer = (
  q: FindOneDTO<UserNoteResourceTypeMappings['includeT']>
) => q;
const queryManyTransformer = (q: QueryUserNoteDTO) => q;

const authorizedRoles: AuthorizedRoles = {
  create: [USER_ROLE.ADMIN, USER_ROLE.STAFF, USER_ROLE.CONSUMER],
  read: [USER_ROLE.ADMIN, USER_ROLE.STAFF, USER_ROLE.CONSUMER],
  update: [USER_ROLE.ADMIN, USER_ROLE.STAFF, USER_ROLE.CONSUMER],
  delete: [USER_ROLE.ADMIN, USER_ROLE.STAFF, USER_ROLE.CONSUMER],
};

@Controller(`${routePrefix}/user-notes`)
export class UserNoteController extends createBaseController<UserNoteResourceTypeMappings>(
  CreateUserNoteDTO,
  UpdateUserNoteDTO,
  FindOneDTO<UserNoteResourceTypeMappings['includeT']>,
  QueryUserNoteDTO,
  allowedIncludes,
  allowedWhere,
  allowedOrderBy,
  queryOneTransformer,
  queryManyTransformer,
  authorizedRoles
) {
  constructor(protected readonly service: UserNoteService) {
    super();
  }

  override canCreate: CanCreateFunctionT<UserNoteResourceTypeMappings> = async (
    user,
    data
  ) => user?.userId == data.userId;
  override canRead: CanReadFunctionT<UserNoteResourceTypeMappings> = async (
    user,
    data
  ) => user?.userId == data.userId;
  override canUpdate: CanUpdateFunctionT<UserNoteResourceTypeMappings> = async (
    user,
    existing,
    data
  ) => user?.userId == existing.userId;
  override canDelete: CanDeleteFunctionT<UserNoteResourceTypeMappings> = async (
    user,
    data
  ) => user?.userId == data.userId;
}

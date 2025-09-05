// eslint-disable-next-line @nx/enforce-module-boundaries
import { FindManyDTO } from '@org/nest/common';
import { UserResourceTypeMappings } from '../../types/user.resource-type-mappings';

export class QueryUserDTO extends FindManyDTO<
  UserResourceTypeMappings['whereT'],
  UserResourceTypeMappings['includeT'],
  UserResourceTypeMappings['orderByT']
> {}

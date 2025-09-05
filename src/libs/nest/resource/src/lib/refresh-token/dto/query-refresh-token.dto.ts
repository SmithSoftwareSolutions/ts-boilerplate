import { RefreshTokenResourceTypeMappings } from '../refresh-token.resource-type-mappings';
import { FindManyDTO } from '@org/nest/common';

export class QueryRefreshTokenDTO extends FindManyDTO<
  RefreshTokenResourceTypeMappings['whereT'],
  RefreshTokenResourceTypeMappings['includeT'],
  RefreshTokenResourceTypeMappings['orderByT']
> {}

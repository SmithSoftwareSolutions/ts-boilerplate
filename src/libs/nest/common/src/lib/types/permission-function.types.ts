// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthenticatedPayload } from '@org/nest/auth';
import { BaseResourceTypeMappings } from './base-resource-type-mapping.type';

export type CanCreateFunctionT<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>
> = (
  user: AuthenticatedPayload | undefined,
  data: ResourceTypeMappings['resourceWithRelationsT']
) => Promise<boolean>;
export type CanReadFunctionT<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>
> = (
  user: AuthenticatedPayload | undefined,
  item: ResourceTypeMappings['resourceWithRelationsT']
) => Promise<boolean>;
export type CanUpdateFunctionT<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>
> = (
  user: AuthenticatedPayload | undefined,
  existing: ResourceTypeMappings['resourceWithRelationsT'],
  updates: ResourceTypeMappings['updateDTO']
) => Promise<boolean>;
export type CanDeleteFunctionT<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>
> = (
  user: AuthenticatedPayload | undefined,
  item: ResourceTypeMappings['resourceWithRelationsT']
) => Promise<boolean>;

import { FindManyDTO } from '../dto/find-many.dto';

export type EmptyObjectType = Record<string, never>;

export type BaseResourceTypeMappings<
  ResourceT,
  ResourceWithRelationsT extends ResourceT = ResourceT,
  ResourceCompositePrimaryKeyT = any,
  CreateT = Partial<ResourceT>,
  UpdateT = Partial<ResourceT>,
  WhereT = Partial<ResourceT>,
  WhereUniqueT = WhereT,
  IncludeT = any,
  OrderByT = any,
  CreateDTO = Partial<ResourceT>,
  UpdateDTO = Partial<ResourceT>,
  QueryDTO extends FindManyDTO<WhereT, IncludeT, OrderByT> = FindManyDTO<
    WhereT,
    IncludeT,
    OrderByT
  >
> = {
  resourceT: ResourceT;
  resourceWithRelationsT: ResourceWithRelationsT;
  resourcePrimaryKeyT: ResourceCompositePrimaryKeyT;
  createT: CreateT;
  updateT: UpdateT;
  whereT: WhereT;
  whereUniqueT: WhereUniqueT;
  includeT: IncludeT;
  orderByT: OrderByT;
  createDTO: CreateDTO;
  updateDTO: UpdateDTO;
  queryDTO: QueryDTO;
};

export type MapPossibleIncludesToRequiredDepth<T, Depth extends number> = {
  [key in keyof T as key extends
    | 'select'
    | 'where'
    | 'orderBy'
    | 'cursor'
    | 'take'
    | 'skip'
    | 'distinct'
    | 'omit'
    ? never
    : key]-?: key extends 'include'
    ? MapPossibleIncludesToRequiredDepth<Exclude<T[key], null>, Depth>
    : key extends '_count'
    ? MapPossibleIncludesToRequiredDepth<Exclude<T[key], null>, 1>
    : Depth extends 1
    ? true
    : Depth extends 2
    ? Exclude<MapPossibleIncludesToRequiredDepth<T[key], 1>, boolean>
    : Depth extends 3
    ? Exclude<MapPossibleIncludesToRequiredDepth<T[key], 2>, boolean>
    : Depth extends 4
    ? Exclude<MapPossibleIncludesToRequiredDepth<T[key], 3>, boolean>
    : Depth extends 5
    ? Exclude<MapPossibleIncludesToRequiredDepth<T[key], 4>, boolean>
    : Exclude<MapPossibleIncludesToRequiredDepth<T[key], 5>, boolean>;
};

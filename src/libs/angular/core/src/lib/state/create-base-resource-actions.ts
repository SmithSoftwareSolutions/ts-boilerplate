import { BaseResourceTypeMappings } from '@org/nest/common';
import { ActionCreator, createAction, props } from '@ngrx/store';

export interface BaseResourceActions<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>
> {
  createItem: ActionCreator<
    any,
    (props: {
      data: ResourceTypeMappings['createDTO'];
      andLoadToCurrent?: boolean;
      loadToCurrentInclude?: ResourceTypeMappings['includeT'];
    }) => any
  >;
  creationSuccessful: ActionCreator<any, any>;
  updateItem: ActionCreator<
    any,
    (props: { id: number; data: ResourceTypeMappings['updateDTO'] }) => any
  >;
  updateSuccessful: ActionCreator<any, any>;
  loadItems: ActionCreator<
    any,
    (props: { query?: ResourceTypeMappings['queryDTO'] }) => any
  >;
  setItems: ActionCreator<
    any,
    (props: {
      items: ResourceTypeMappings['resourceWithRelationsT'][];
      page?: number;
      itemCount?: number;
    }) => any
  >;
  loadItem: ActionCreator<
    any,
    (props: {
      id: number | string;
      include?: ResourceTypeMappings['includeT'];
    }) => any
  >;
  setCurrent: ActionCreator<
    any,
    (props: { item: ResourceTypeMappings['resourceWithRelationsT'] }) => any
  >;
  deleteItem: ActionCreator<
    any,
    (props: {
      id: number | string | ResourceTypeMappings['whereUniqueT'];
    }) => any
  >;
  deletionSuccessful: ActionCreator<any, any>;
  clearCurrent: ActionCreator<any, any>;
  setError: ActionCreator<any, any>;
  clearError: ActionCreator<any, any>;
  refreshItem: ActionCreator<any, any>;
}

export const createBaseResourceActions = <
  ResourceTypeMappings extends BaseResourceTypeMappings<any>
>(
  domainSlug: string
): BaseResourceActions<ResourceTypeMappings> => {
  return {
    createItem: createAction(
      `${domainSlug} Create Item`,
      props<{
        data: ResourceTypeMappings['createDTO'];
        andLoadToCurrent?: boolean;
        loadToCurrentInclude?: ResourceTypeMappings['includeT'];
      }>()
    ),
    creationSuccessful: createAction(`${domainSlug} Creation Successful`),
    updateItem: createAction(
      `${domainSlug} Update Item`,
      props<{
        id: ResourceTypeMappings['resourcePrimaryKeyT'];
        data: ResourceTypeMappings['updateDTO'];
      }>()
    ),
    updateSuccessful: createAction(`${domainSlug} Update Successful`),
    loadItems: createAction(
      `${domainSlug} Load Items`,
      props<{ query?: ResourceTypeMappings['queryDTO'] }>()
    ),
    setItems: createAction(
      `${domainSlug} Set Items`,
      props<{
        items: ResourceTypeMappings['resourceWithRelationsT'][];
        page?: number;
      }>()
    ),
    loadItem: createAction(
      `${domainSlug} Load Item`,
      props<{ id: ResourceTypeMappings['resourcePrimaryKeyT'] }>()
    ),
    setCurrent: createAction(
      `${domainSlug} Set Current`,
      props<{ item: ResourceTypeMappings['resourceWithRelationsT'] }>()
    ),
    clearCurrent: createAction(`${domainSlug} Clear Current`),
    deleteItem: createAction(
      `${domainSlug} Delete Item`,
      props<{
        id: ResourceTypeMappings['resourcePrimaryKeyT'];
      }>()
    ),
    deletionSuccessful: createAction(`${domainSlug} Creation Successful`),
    setError: createAction(
      `${domainSlug} Set Error`,
      props<{
        error: string;
      }>()
    ),
    clearError: createAction(`${domainSlug} Clear Error`),
    refreshItem: createAction(`${domainSlug} Refresh Item`),
  };
};

import { BaseResourceTypeMappings } from '@org/nest/common';
import { createReducer, on } from '@ngrx/store';
import { BaseResourceActions } from './create-base-resource-actions';

export interface BaseResourceState<
  ResourceTypeMappings extends BaseResourceTypeMappings<any>
> {
  currentQuery?: ResourceTypeMappings['queryDTO'] | null;
  currentItemIncludes?: ResourceTypeMappings['includeT'] | null;
  items: ResourceTypeMappings['resourceWithRelationsT'][];
  current: ResourceTypeMappings['resourceWithRelationsT'] | null;
  itemsLoading: boolean;
  currentLoading: boolean;
  page?: number;
  itemCount?: number;
  error?: string | null;
}

export const initialResourceState: BaseResourceState<any> = {
  items: [],
  current: null,
  itemsLoading: false,
  currentLoading: false,
};

export const createBaseResourceReducer = <
  ResourceTypeMappings extends BaseResourceTypeMappings<any>,
  StateType extends BaseResourceState<ResourceTypeMappings>,
  ActionsT extends BaseResourceActions<ResourceTypeMappings> = BaseResourceActions<ResourceTypeMappings>
>(
  initialState: StateType,
  actions: ActionsT,
  additionalReducers: any[] = []
) =>
  createReducer(
    initialState,
    on(actions.updateItem, (state, { id, data }) => ({
      ...state,
      currentLoading: state.current?.id == id,
    })),
    on(actions.loadItems, (state, { query }) => ({
      ...state,
      currentQuery: query,
      itemsLoading: true,
    })),
    on(actions.setItems, (state, { items, page, itemCount }) => ({
      ...state,
      items,
      page,
      itemCount,
      itemsLoading: false,
    })),
    on(actions.loadItem, (state, { id, include }) => ({
      ...state,
      currentItemIncludes: include,
      currentLoading: true,
    })),
    on(actions.setCurrent, (state, { item }) => ({
      ...state,
      current: item,
      currentLoading: false,
    })),
    on(actions.clearCurrent, (state) => ({
      ...state,
      current: null,
    })),
    on(actions.setError, (state, { error }) => ({
      ...state,
      error,
      currentLoading: false,
      itemsLoading: false,
    })),
    on(actions.clearError, (state) => ({
      ...state,
      error: null,
    })),
    ...additionalReducers
  );

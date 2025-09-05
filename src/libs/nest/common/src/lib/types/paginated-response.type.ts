import { PaginationData } from './pagination-data.type';

export interface PaginatedResponse<T = any> {
  data: T[];
  metadata: PaginationData<T> & {
    total: number;
  };
}

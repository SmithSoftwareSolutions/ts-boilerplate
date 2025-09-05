import { OrderBy } from './order-by.type';

export interface PaginationData<T = any> {
  page?: number;
  pages?: number;
  pageSize?: number;
  orderBy?: OrderBy<T>;
}

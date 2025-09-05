import { Prisma } from '@prisma/client';

export type OrderBy<T = any> = {
  [key in keyof T]: Prisma.SortOrder | Prisma.SortOrderInput | OrderBy<T[key]>;
};

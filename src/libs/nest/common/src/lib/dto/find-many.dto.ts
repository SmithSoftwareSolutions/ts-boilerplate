/* eslint-disable @typescript-eslint/no-explicit-any */

import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional } from 'class-validator';
import { DateTime } from 'luxon';
import { OrderBy } from '../types/order-by.type';

export class FindManyDTO<
  WhereT = any,
  IncludeT = Includes,
  OrderByT = OrderBy
> {
  @IsOptional()
  @IsNumber()
  page?: number;
  @IsOptional()
  @IsNumber()
  pageSize?: number;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => JSON.parse(value))
  orderBy?: OrderByT;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => JSON.parse(value))
  include?: IncludeT;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => convertDates(JSON.parse(value)))
  where?: WhereT;
}

const convertDates = (obj: any) => {
  const copy = JSON.parse(JSON.stringify(obj));
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value == 'object') copy[key] = convertDates(value);
    if (typeof value == 'string') {
      const dateTime = DateTime.fromISO(value);
      if (dateTime.isValid && value.match(/.+[-:/,].+/g))
        copy[key] = dateTime.toJSDate();
    }
  }
  return copy;
};

export interface Includes {
  [relationship: string]: boolean | Includes;
}

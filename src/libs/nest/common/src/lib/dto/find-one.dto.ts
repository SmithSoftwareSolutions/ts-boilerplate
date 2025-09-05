import { IsObject, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { Includes } from './find-many.dto';

export class FindOneDTO<IncludeT = Includes> {
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => JSON.parse(value))
  include?: IncludeT;
}

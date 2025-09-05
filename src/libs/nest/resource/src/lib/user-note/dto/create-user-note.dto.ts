import {
  IsDate,
  IsDecimal,
  IsNumber,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsBoolean } from '@org/nest/common';

export class CreateUserNoteDTO {
  @IsInt()
  @IsOptional()
  userId?: number;
  @IsString()
  content!: string;
}

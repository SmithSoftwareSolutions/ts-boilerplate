import {
  IsDate,
  IsDecimal,
  IsNumber,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsBoolean } from '@org/nest/common';

export class CreateRefreshTokenDTO {
  @IsString()
  token!: string;
  @IsDate()
  expires!: Date;
  @IsInt()
  @IsOptional()
  userId?: number;
}

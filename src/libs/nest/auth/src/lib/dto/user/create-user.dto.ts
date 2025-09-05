// eslint-disable-next-line @nx/enforce-module-boundaries
import { IsBoolean } from '@org/nest/common';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  email!: string;

  @IsInt()
  @IsOptional()
  retryCount?: number;

  @IsDate()
  @IsOptional()
  lockedOutUntil?: Date;

  @IsString()
  @IsOptional()
  passwordResetToken?: string;

  @IsString()
  @IsOptional()
  notificationRegistrationToken?: string;

  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
}

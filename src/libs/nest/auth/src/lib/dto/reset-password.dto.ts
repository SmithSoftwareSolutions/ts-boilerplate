import { ContainsSpecialCharacter } from './register.dto';
import { IsNumber, IsString, MinLength, Validate } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @MinLength(6)
  @Validate(ContainsSpecialCharacter, {})
  newPassword!: string;

  @IsString()
  token!: string;
  @IsNumber()
  userId!: number;
}

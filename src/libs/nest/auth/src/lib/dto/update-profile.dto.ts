import { IsEmail, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  firstName!: string;
  @IsString()
  lastName!: string;
  @IsString()
  @IsEmail()
  email!: string;
}

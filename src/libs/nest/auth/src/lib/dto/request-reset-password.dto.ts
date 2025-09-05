import { IsString } from 'class-validator';

export class RequestResetPasswordDTO {
  @IsString()
  email!: string;
}

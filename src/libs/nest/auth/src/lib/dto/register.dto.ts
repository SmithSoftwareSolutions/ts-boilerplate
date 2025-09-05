import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'containsSpecialCharacter', async: false })
export class ContainsSpecialCharacter implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: string, args: ValidationArguments) {
    const specialCharacterRegex = new RegExp(/[^A-Za-z0-9]/g);
    return specialCharacterRegex.test(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return '$property must contain a special character';
  }
}

export class RegisterDTO {
  @IsString()
  firstName!: string;
  @IsString()
  lastName!: string;
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @Validate(ContainsSpecialCharacter, {})
  password?: string;
}

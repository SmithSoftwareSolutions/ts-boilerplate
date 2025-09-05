import { BadRequestException } from '@nestjs/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BaseError } from '@org/nest/common';

export class ExistingUserError extends BaseError {
  constructor(message = 'User with that email already exists') {
    super(message);
  }

  override toHttp() {
    return new BadRequestException(this.message);
  }
}

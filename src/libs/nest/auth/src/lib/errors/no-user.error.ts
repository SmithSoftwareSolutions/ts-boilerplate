import { BadRequestException } from '@nestjs/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BaseError } from '@org/nest/common';

export class NoUserError extends BaseError {
  constructor(message = 'No user exists for supplied id') {
    super(message);
  }

  override toHttp() {
    return new BadRequestException(this.message);
  }
}

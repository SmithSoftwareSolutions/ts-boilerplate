import { BadRequestException } from '@nestjs/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BaseError } from '@org/nest/common';

export class WeakPasswordError extends BaseError {
  constructor(message = 'Password does not meet minimum standards') {
    super(message);
  }

  override toHttp() {
    return new BadRequestException(this.message);
  }
}

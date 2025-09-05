// eslint-disable-next-line @nx/enforce-module-boundaries
import { BaseError } from '@org/nest/common';
import { UnauthorizedException } from '@nestjs/common';

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized') {
    super(message);
  }

  override toHttp() {
    return new UnauthorizedException(this.message);
  }
}

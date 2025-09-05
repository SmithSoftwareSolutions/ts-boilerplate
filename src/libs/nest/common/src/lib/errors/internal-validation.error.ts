import { BadRequestException } from '@nestjs/common';
import { BaseError } from './base.error';

export class InternalValidationError extends BaseError {
  constructor(message = 'Failed to pass internal validation') {
    super(message);
  }

  override toHttp() {
    return new BadRequestException(this.message);
  }
}

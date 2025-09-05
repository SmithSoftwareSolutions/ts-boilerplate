import { BadRequestException } from '@nestjs/common';
import { BaseError } from '@org/nest/common';

export class InvalidAddressError extends BaseError {
  constructor(message = 'Invalid address') {
    super(message);
  }

  override toHttp() {
    return new BadRequestException(this.message);
  }
}

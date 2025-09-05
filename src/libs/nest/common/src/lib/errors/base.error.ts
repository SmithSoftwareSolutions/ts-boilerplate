import { HttpException, InternalServerErrorException } from '@nestjs/common';

export class BaseError extends Error {
  toHttp(): HttpException {
    return new InternalServerErrorException(this.message);
  }
}

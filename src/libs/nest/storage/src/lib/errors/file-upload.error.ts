import { BaseError } from '@org/nest/common';

export class UploadFailedError extends BaseError {
  constructor(message = 'Failed to upload file') {
    super(message);
  }
}

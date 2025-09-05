import { UnauthorizedError } from './unauthorized.error';

export class InvalidCredentialsError extends UnauthorizedError {
  constructor(message = 'Invalid credentials') {
    super(message);
  }
}

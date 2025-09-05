import { UnauthorizedError } from './unauthorized.error';

export class UserLockoutError extends UnauthorizedError {
  constructor(
    message = `Login failed too many times, you are temporarily locked out, try again in 5 minutes`
  ) {
    super(message);
  }
}

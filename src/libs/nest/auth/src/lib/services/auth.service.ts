/* eslint-disable @typescript-eslint/no-explicit-any */

import { AuthenticatedPayload } from '../types/user-payload.type';
import { BadRequestException, Injectable } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { DateTime } from 'luxon';
import { EmailService } from '@org/nest/communication';
import { ExistingUserError } from '../errors/existing-user.error';
import { HttpService } from '@nestjs/axios';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { RefreshTokenPayload } from '../types/refresh-token-payload.type';
import { RegisterDTO } from '../dto/register.dto';
import { TokenService } from './token.service';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { User } from '@prisma/client';
import { USER_ROLE } from '../enums/user-role.enum';
import { UserLockoutError } from '../errors/user-lockout.error';
import { UserResourceTypeMappings } from '../types/user.resource-type-mappings';
import { UserService } from './user.service';
import { WeakPasswordError } from '../errors/weak-password.error';

type UserWithProfile = UserResourceTypeMappings['resourceWithRelationsT'];

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

  async registerAndGetTokens(
    firstName: string,
    lastName: string,
    email: string,
    password: string | undefined
  ) {
    // confirm no user already exists
    const existingUser = await this.userService.get({
      email,
    });
    if (existingUser) {
      throw new ExistingUserError();
    }

    const specialCharacterRegex = new RegExp(/[^A-Za-z0-9]/g);
    // confirm password requirements
    if (
      password &&
      (password.length < 6 || !specialCharacterRegex.test(password))
    ) {
      throw new WeakPasswordError();
    }

    const hashedPassword = hashSync(password!, 10);
    // create user
    await this.userService.create({
      firstName,
      lastName,
      email,
      passwordHash: hashedPassword,
    });

    const user = await this.userService.get<UserWithProfile>(
      { email },
      undefined,
      false
    );

    // sign JWT
    return {
      accessToken: await this.tokenService.signJWT<AuthenticatedPayload>({
        userId: user.id,
        email: user.email,
        roles: user.roles as USER_ROLE[],
      }),
      refreshToken: await this.tokenService.generateAndSaveRefreshToken(
        user.id
      ),
      user,
    };
  }

  async loginAndGetTokens(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    // get user with password
    const user = await this.userService.get<UserWithProfile>(
      { email },
      undefined,
      true
    );

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (user.lockedOutUntil) {
      const lockoutDate = DateTime.fromJSDate(user.lockedOutUntil);
      if (lockoutDate.diffNow().toMillis() > 0) {
        throw new UserLockoutError();
      }
    }
    // validate password
    const validPassword = compareSync(password, user.passwordHash);
    if (!validPassword) {
      // increment retry count
      await this.userService.update(
        { id: user.id },
        {
          retryCount: user.retryCount + 1,
        }
      );

      if (user.retryCount + 1 >= 5) {
        const lockedOutUntil = DateTime.now().plus({
          minutes: 5,
        });
        await this.userService.update(
          { id: user.id },
          {
            lockedOutUntil: lockedOutUntil.toJSDate(),
          }
        );
        // lockout
        throw new UserLockoutError();
      }
      throw new InvalidCredentialsError();
    } else {
      await this.userService.update(
        { id: user.id },
        {
          retryCount: 0,
          lockedOutUntil: null,
        }
      );
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete user.passwordHash;

    // sign JWT
    return {
      accessToken: await this.tokenService.signJWT<AuthenticatedPayload>({
        userId: user.id,
        email: user.email,
        roles: user.roles as USER_ROLE[],
      }),
      refreshToken: await this.tokenService.generateAndSaveRefreshToken(
        user.id
      ),
      user,
    };
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.tokenService.validateJWT<RefreshTokenPayload>(
      refreshToken
    );
    const user = await this.userService.get<UserWithProfile>({
      id: payload.userId,
    });

    const dbToken = await this.tokenService.getTokenFromDB(refreshToken);
    if (!user || !dbToken || dbToken.userId != payload.userId) {
      console.log('MISSING', user, dbToken, dbToken?.userId, payload.userId);
      throw new BadRequestException();
    } else {
      console.log('NOT MISSING', user, dbToken, dbToken.userId, payload.userId);
    }

    await this.tokenService.deleteTokenFromDB(dbToken.id);

    return {
      accessToken: await this.tokenService.signJWT<AuthenticatedPayload>({
        userId: user.id,
        email: user.email,
        roles: user.roles as USER_ROLE[],
      }),
      refreshToken: await this.tokenService.generateAndSaveRefreshToken(
        user.id
      ),
      user,
    };
  }

  async generateResetPasswordToken(userId: number) {
    const token = randomBytes(128).toString('hex');
    const hash = createHash('sha256').update(token).digest('base64');

    await this.userService.update({ id: userId }, { passwordResetToken: hash });

    return token;
  }

  async handleResetPassword(
    userId: number,
    token: string,
    newPassword: string
  ) {
    const user = await this.userService.get({ id: userId }, undefined, true);
    const hash = createHash('sha256').update(token).digest('base64');

    if (hash != user?.passwordResetToken)
      throw new UnauthorizedError('Invalid token');

    const specialCharacterRegex = new RegExp(/[^A-Za-z0-9]/g);
    // confirm password requirements
    if (newPassword.length < 6 || !specialCharacterRegex.test(newPassword)) {
      throw new WeakPasswordError();
    }

    const hashedPassword = hashSync(newPassword, 10);

    const userRes = await this.userService.update(
      { id: userId },
      {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        retryCount: 0,
        lockedOutUntil: null,
      }
    );

    delete (userRes as any).password;

    return userRes;
  }

  async seed() {
    const createDefaultAdminUserDTO: RegisterDTO = {
      firstName: 'Admin',
      lastName: 'SSS',
      email: 'admin@smithsolutions.io',
      password: 'InitialAdminPassword!',
    };
    const existingUser = (
      await this.userService.getMany({
        email: createDefaultAdminUserDTO.email,
      })
    ).data?.[0];
    if (!existingUser) {
      const authenticated = await this.registerAndGetTokens(
        createDefaultAdminUserDTO.firstName,
        createDefaultAdminUserDTO.lastName,
        createDefaultAdminUserDTO.email,
        createDefaultAdminUserDTO.password
      );
      await this.userService.update(
        {
          id: authenticated.user.id,
        },
        {
          roles: [...authenticated.user.roles, USER_ROLE.ADMIN],
        }
      );
    }
  }
}

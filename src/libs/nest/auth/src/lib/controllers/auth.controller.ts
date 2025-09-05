/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthGuard } from '../guards/auth.guard';
import { AuthResponse } from '../types/auth-response.type';
import { AuthService } from '../services/auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { BaseError } from '@org/nest/common';
import { EmailService } from '@org/nest/communication';
import { FastifyReply } from 'fastify';
import { FastifyRequestWithUser } from '../types/fastify-request-with-user.type';
import { LoginDTO } from '../dto/login.dto';
import { RegisterDTO } from '../dto/register.dto';
import { RequestResetPasswordDTO } from '../dto/request-reset-password.dto';
import { ResetPasswordDTO } from '../dto/reset-password.dto';
import { TokenExpiredError } from 'jsonwebtoken';
import { UpdateProfileDTO } from '../dto/update-profile.dto';
import { User } from '@prisma/client';
import { UserService } from '../services/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}

  @Post('register')
  async register(
    @Body() body: RegisterDTO,
    @Res({ passthrough: true }) response: FastifyReply
  ): Promise<AuthResponse> {
    try {
      // check credentials and get tokens
      const tokensAndUser = await this.authService.registerAndGetTokens(
        body.firstName,
        body.lastName,
        body.email,
        body.password ?? ''
      );

      // attach tokens to cookies
      (response as any).setCookie('access-token', tokensAndUser.accessToken, {
        httpOnly: true,
        path: '/',
      });
      (response as any).setCookie('refresh-token', tokensAndUser.refreshToken, {
        httpOnly: true,
        path: '/auth/refresh',
      });

      return {
        message: 'Successfully Logged In',
        data: {
          user: tokensAndUser.user,
        },
      };
    } catch (e) {
      if (e instanceof BaseError) {
        throw e.toHttp();
      }

      throw e;
    }
  }

  @Post('login')
  async login(
    @Body() body: LoginDTO,
    @Res({ passthrough: true }) response: FastifyReply
  ): Promise<AuthResponse> {
    try {
      // check credentials and get tokens
      const tokensAndUser = await this.authService.loginAndGetTokens(
        body.email,
        body.password
      );

      // attach tokens to cookies
      (response as any).setCookie('access-token', tokensAndUser.accessToken, {
        httpOnly: true,
        path: '/',
      });
      (response as any).setCookie('refresh-token', tokensAndUser.refreshToken, {
        httpOnly: true,
        path: '/auth/refresh',
      });

      return {
        message: 'Successfully Logged In',
        data: {
          user: tokensAndUser.user,
        },
      };
    } catch (e) {
      if (e instanceof BaseError) {
        throw e.toHttp();
      }

      throw e;
    }
  }

  @Post('refresh')
  async refresh(
    @Request() req: FastifyRequestWithUser,
    @Res({ passthrough: true }) response: FastifyReply
  ): Promise<AuthResponse> {
    try {
      const splitCookiesString = req.headers.cookie?.split(';');
      const cookies: Record<string, string> | undefined =
        splitCookiesString?.reduce(
          (mappedCookies: Record<string, string>, cookieString: string) => {
            const splitCookieString = cookieString.split('=');
            mappedCookies[splitCookieString?.[0]?.replace(' ', '')] =
              splitCookieString?.[1];
            return mappedCookies;
          },
          {}
        );

      const refreshToken = cookies?.['refresh-token'];

      if (!refreshToken)
        throw new UnauthorizedException('No Refresh Token Provided');
      const tokensAndUser = await this.authService.refreshTokens(refreshToken);

      (response as any).setCookie('access-token', tokensAndUser.accessToken, {
        httpOnly: true,
        path: '/',
      });
      (response as any).setCookie('refresh-token', tokensAndUser.refreshToken, {
        httpOnly: true,
        path: '/auth/refresh',
      });

      return {
        message: 'Successfully Refreshed Access Token',
        data: {
          user: tokensAndUser.user,
        },
      };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (e instanceof BaseError) {
        throw e.toHttp();
      }

      throw e;
    }
  }

  @UseGuards(AuthGuard)
  @Patch('profile/:id')
  async updateProfile(
    @Req() request: FastifyRequestWithUser,
    @Param('id') id: number,
    @Body() updates: UpdateProfileDTO
  ): Promise<User> {
    try {
      if (request.user?.userId != id) {
        throw new UnauthorizedException();
      }
      const user = await this.userService.update(
        { id },
        {
          ...updates,
        }
      );
      delete (user as any).password;
      delete (user as any).passwordResetToken;
      return user as User;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (e instanceof BaseError) {
        throw e.toHttp();
      }

      throw e;
    }
  }

  @Post('request-reset-password')
  async requestResetPassword(@Body() body: RequestResetPasswordDTO) {
    try {
      const user = await this.userService.get({ email: body.email });
      if (!user) throw new BadRequestException();

      const token = await this.authService.generateResetPasswordToken(user.id);

      return await this.emailService.sendResetPasswordEmail(
        body.email,
        `${process.env['MAIN_APP_URL_BASE']}/reset-password/${user.id}/${token}`
      );
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (e instanceof BaseError) {
        throw e.toHttp();
      }

      throw e;
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDTO,
    @Request() request: FastifyRequestWithUser
  ) {
    try {
      return await this.authService.handleResetPassword(
        body.userId,
        body.token,
        body.newPassword
      );
    } catch (e) {
      if (e instanceof BaseError) {
        throw e.toHttp();
      }

      throw e;
    }
  }
}

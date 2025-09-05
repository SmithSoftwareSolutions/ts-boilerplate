import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';
import { DateTime } from 'luxon';

@Injectable()
export class TokenService {
  unscopedPrisma = new PrismaClient();
  get prisma() {
    return this.unscopedPrisma.refreshToken;
  }
  signJWT<T>(payload: T, expiresIn?: number): Promise<string> {
    return new Promise((res, rej) => {
      sign(
        payload as object,
        process.env['JWT_SECRET']!,
        {
          expiresIn:
            expiresIn ?? parseInt(process.env['ACCESS_TOKEN_EXPIRATION']!),
        },
        (err?, token?: string) => {
          if (err) rej(err);

          res(token!);
        }
      );
    });
  }

  validateJWT<T>(token: string): Promise<T> {
    return new Promise((res, rej) => {
      verify(token, process.env['JWT_SECRET']!, {}, (err, decoded) => {
        if (err) rej(err);

        res(decoded as T);
      });
    });
  }

  async generateAndSaveRefreshToken(userId: number): Promise<string> {
    const expirationSeconds = parseInt(
      process.env['REFRESH_TOKEN_EXPIRATION']!
    );
    const newRefreshToken = await this.signJWT({ userId }, expirationSeconds);
    const expirationDate = DateTime.now()
      .plus({ seconds: expirationSeconds })
      .toJSDate();
    await this.prisma.create({
      data: {
        token: newRefreshToken,
        expires: expirationDate,
        userId,
      },
    });

    return newRefreshToken;
  }

  getTokenFromDB(refreshToken: string) {
    return this.prisma.findFirst({
      where: {
        token: refreshToken,
      },
    });
  }

  deleteTokenFromDB(id: number) {
    return this.prisma.delete({
      where: {
        id,
      },
    });
  }
}

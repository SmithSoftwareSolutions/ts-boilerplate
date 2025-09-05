import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { CommunicationModule } from '@org/nest/communication';
import { DynamicModule, Module } from '@nestjs/common';
import { GCloudAuthGuard } from './guards/gcloud-auth.guard';
import { HttpModule } from '@nestjs/axios';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';

@Module({
  imports: [HttpModule, CommunicationModule],
  controllers: [],
  providers: [
    AuthService,
    TokenService,
    UserService,
    AuthGuard,
    GCloudAuthGuard,
  ],
  exports: [AuthService, TokenService, UserService, AuthGuard, GCloudAuthGuard],
})
export class AuthModule {
  static withControllers(): DynamicModule {
    return {
      module: AuthModule,
      controllers: [AuthController],
    };
  }
}

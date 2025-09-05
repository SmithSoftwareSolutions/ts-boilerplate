import { AuthModule } from '@org/nest/auth';
import { DynamicModule, Module, forwardRef } from '@nestjs/common';
import { RefreshTokenController } from './refresh-token.controller';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {
  static withControllers(): DynamicModule {
    return {
      module: RefreshTokenModule,
      controllers: [RefreshTokenController],
    };
  }
}

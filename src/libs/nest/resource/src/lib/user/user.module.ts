import { AuthModule } from '@org/nest/auth';
import { DynamicModule, Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [AuthModule],
  providers: [],
  exports: [],
})
export class UserModule {
  static withControllers(): DynamicModule {
    return {
      module: UserModule,
      controllers: [UserController],
    };
  }
}

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@org/nest/auth';
import { CommunicationModule } from '@org/nest/communication';
import { FunctionModule } from '@org/nest/function';
import { Module } from '@nestjs/common';
import { ResourceModule } from '@org/nest/resource';
import { StorageModule } from '@org/nest/storage';

@Module({
  imports: [
    AuthModule.withControllers(),
    ResourceModule.withControllers(),
    CommunicationModule.withControllers(),
    FunctionModule.withControllers(),
    StorageModule.withControllers(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

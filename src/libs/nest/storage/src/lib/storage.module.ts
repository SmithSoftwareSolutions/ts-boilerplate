import { AuthModule } from '@org/nest/auth';
import { DynamicModule, Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';

@Module({
  imports: [AuthModule],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {
  static withControllers(): DynamicModule {
    return {
      module: StorageModule,
      controllers: [StorageController],
    };
  }
}

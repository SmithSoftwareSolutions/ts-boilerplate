import { DynamicModule, Module } from '@nestjs/common';
import { services } from './services/index.services';

@Module({
  imports: [],
  providers: [...services],
  exports: [...services],
})
export class CommunicationModule {
  static withControllers(): DynamicModule {
    return {
      module: CommunicationModule,
      controllers: [],
    };
  }
}

import { DynamicModule, Module } from '@nestjs/common';
import { resourceModules } from './index.modules';

@Module({
  imports: [...resourceModules],
  controllers: [],
  providers: [],
  exports: [...resourceModules],
})
export class ResourceModule {
  static withControllers(): DynamicModule {
    return {
      module: ResourceModule,
      imports: [...resourceModules.map((m) => m.withControllers())],
    };
  }
}

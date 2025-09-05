import { DynamicModule, Module } from '@nestjs/common';
import { functionModules } from './index.modules';

@Module({
  imports: [...functionModules],
  providers: [],
  exports: [...functionModules],
})
export class FunctionModule {
  static withControllers(): DynamicModule {
    return {
      module: FunctionModule,
      imports: [...functionModules.map((m) => m.withControllers())],
    };
  }
}

// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthModule } from '@org/nest/auth';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class CommonModule {}

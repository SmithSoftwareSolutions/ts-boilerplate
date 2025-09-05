import { AppService } from './app.service';
import { AuthModule } from '@org/nest/auth';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}

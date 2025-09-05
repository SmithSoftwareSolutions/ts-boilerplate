import { AuthModule } from '@org/nest/auth';
import { DynamicModule, Module, forwardRef } from '@nestjs/common';
import { UserNoteController } from './user-note.controller';
import { UserNoteService } from './user-note.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [UserNoteService],
  exports: [UserNoteService],
})
export class UserNoteModule {
  static withControllers(): DynamicModule {
    return {
      module: UserNoteModule,
      controllers: [UserNoteController],
    };
  }
}

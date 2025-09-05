import { PartialType } from '@nestjs/swagger';
import { CreateUserNoteDTO } from './create-user-note.dto';

export class UpdateUserNoteDTO extends PartialType(CreateUserNoteDTO) {}

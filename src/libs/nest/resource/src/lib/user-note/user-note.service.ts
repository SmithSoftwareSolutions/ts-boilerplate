import { BaseResourceService } from '@org/nest/common';
import { UserNote, Prisma } from '@prisma/client';
import {
  UserNoteResourceTypeMappings,
  userNoteCompositeKeyOrder,
} from './user-note.resource-type-mappings';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserNoteService extends BaseResourceService<UserNoteResourceTypeMappings> {
  override get prisma() {
    return this.unscopedPrisma.userNote;
  }

  constructor() {
    super('userNote', userNoteCompositeKeyOrder);
  }
}

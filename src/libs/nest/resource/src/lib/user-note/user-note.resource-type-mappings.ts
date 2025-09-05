import { UserNote, Prisma } from '@prisma/client';
import { CreateUserNoteDTO } from './dto/create-user-note.dto';
import { UpdateUserNoteDTO } from './dto/update-user-note.dto';
import { QueryUserNoteDTO } from './dto/query-user-note.dto';

import {
  BaseResourceTypeMappings,
  MapPossibleIncludesToRequiredDepth,
} from '@org/nest/common';
import { XOR } from '@org/ts/common';

export type UserNoteResourceTypeMappings = BaseResourceTypeMappings<
  UserNote,
  UserNote &
    Exclude<
      Partial<
        Prisma.UserNoteGetPayload<{
          include: MapPossibleIncludesToRequiredDepth<
            Prisma.UserNoteInclude,
            4
          >;
        }>
      >,
      UserNote
    >,
  number,
  XOR<Prisma.UserNoteCreateInput, Prisma.UserNoteUncheckedCreateInput>,
  XOR<Prisma.UserNoteUpdateInput, Prisma.UserNoteUncheckedUpdateInput>,
  Prisma.UserNoteWhereInput,
  Prisma.UserNoteWhereUniqueInput,
  Prisma.UserNoteInclude,
  Prisma.UserNoteOrderByWithRelationInput,
  CreateUserNoteDTO,
  UpdateUserNoteDTO,
  QueryUserNoteDTO
>;

export const userNoteCompositeKeyOrder: (keyof UserNoteResourceTypeMappings['resourceT'])[] =
  ['id'];

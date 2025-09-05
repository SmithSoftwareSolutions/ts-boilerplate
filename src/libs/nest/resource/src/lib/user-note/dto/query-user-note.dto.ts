import { UserNoteResourceTypeMappings } from '../user-note.resource-type-mappings';
import { FindManyDTO } from '@org/nest/common';

export class QueryUserNoteDTO extends FindManyDTO<
  UserNoteResourceTypeMappings['whereT'],
  UserNoteResourceTypeMappings['includeT']
> {}

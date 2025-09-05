import { createBaseResourceActions } from '../create-base-resource-actions';
import { UserNoteResourceTypeMappings } from '@org/nest/resource';

const domainSlug = '[USER NOTE]';
export const userNoteActions =
  createBaseResourceActions<UserNoteResourceTypeMappings>(domainSlug);

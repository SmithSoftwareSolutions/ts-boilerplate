import { IsEnum } from 'class-validator';
import { UPLOAD_TYPE } from '../enums/upload-type.enum';

export class DuplicateFileDTO {
  @IsEnum(UPLOAD_TYPE)
  uploadType!: UPLOAD_TYPE;
}

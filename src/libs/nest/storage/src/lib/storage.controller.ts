import { AuthGuard, Roles, USER_ROLE } from '@org/nest/auth';
import { BaseError } from '@org/nest/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DuplicateFileDTO } from './dto/duplicate-file.dto';
import { StorageService } from './storage.service';
import { UPLOAD_TYPE } from './enums/upload-type.enum';

@UseGuards(AuthGuard)
@Controller('storage')
export class StorageController {
  constructor(protected readonly storageService: StorageService) {}

  @Roles(USER_ROLE.ADMIN)
  @Post('upload')
  async upload(@Body() body: any) {
    try {
      console.log(body);
      const file = body.file;
      const path = await this.storageService.uploadFile(
        file.filename,
        parseInt(body.type.value) ?? UPLOAD_TYPE.DEFAULT,
        await file.toBuffer(),
        file.mimetype
      );

      return {
        path,
      };
    } catch (e) {
      if (e instanceof BaseError) {
        throw e.toHttp();
      }

      throw e;
    }
  }

  @Roles(USER_ROLE.ADMIN)
  @Get('upload-url/:type/:fileName')
  async getUploadURL(
    @Param('type') fileType: number,
    @Param('fileName') fileName: string,
    @Query('mimeType') mimeType: string
  ) {
    return await this.storageService.getSignedUploadURL(
      fileName,
      fileType as UPLOAD_TYPE,
      mimeType
    );
  }

  @Roles(USER_ROLE.ADMIN)
  @Get('*')
  async get(@Param('*') path: string) {
    console.log(path);
    return { url: await this.storageService.getSignedURL(path) };
  }

  @Roles(USER_ROLE.ADMIN)
  @Post('duplicate/*')
  async duplicate(
    @Param('*') existingFilePath: string,
    @Body() body: DuplicateFileDTO
  ) {
    try {
      const path = await this.storageService.duplicateFile(
        existingFilePath,
        body.uploadType
      );

      return {
        path,
      };
    } catch (e) {
      if (e instanceof BaseError) {
        throw e.toHttp();
      }

      throw e;
    }
  }

  @Roles(USER_ROLE.ADMIN)
  @Delete('*')
  async delete(@Param('*') path: string) {
    return await this.storageService.deleteFile(path);
  }
}

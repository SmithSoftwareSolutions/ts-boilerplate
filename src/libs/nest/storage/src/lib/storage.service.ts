import {
  AUDIO_FILE_TYPES,
  DOCUMENT_FILE_TYPES,
  IMAGE_FILE_TYPES,
  PLAYABLE_MEDIA_EXPIRATION,
  STATIC_MEDIA_EXPIRATION,
  VIDEO_FILE_TYPES,
} from './storage.config';
import { DateTime } from 'luxon';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { UPLOAD_TYPE } from './enums/upload-type.enum';
import { UploadFailedError } from './errors/file-upload.error';

@Injectable()
export class StorageService {
  protected storage!: Storage;
  protected bucket!: string;

  constructor() {
    this.setupStorageConnection();
  }

  protected getAdjustedFileName(fileName: string, uploadType?: UPLOAD_TYPE) {
    let destination = '';
    const extension = fileName.split('.').at(-1)?.toLowerCase() ?? '';
    if (IMAGE_FILE_TYPES.includes(extension)) {
      destination = 'images';
    } else if (VIDEO_FILE_TYPES.includes(extension)) {
      destination = 'videos';
    } else if (AUDIO_FILE_TYPES.includes(extension)) {
      destination = 'audios';
    } else if (DOCUMENT_FILE_TYPES.includes(extension)) {
      destination = 'documents';
    } else {
      destination = 'default';
    }
    destination = `uploads/${destination}/${UPLOAD_TYPE[
      uploadType ?? UPLOAD_TYPE.DEFAULT
    ]
      .toLowerCase()
      .replace('_', '-')}/${DateTime.now().toUTC().toString()}-${fileName}`;

    return destination;
  }

  protected setupStorageConnection() {
    this.storage = new Storage({
      keyFilename: process.env['IS_LOCAL']
        ? 'cloud-service-key.json'
        : undefined,
    } as any);

    this.bucket = process.env['GCLOUD_STORAGE_BUCKET']!;
  }

  async getSignedUploadURL(
    fileName: string,
    uploadType: UPLOAD_TYPE,
    mimeType: string
  ) {
    const destination = this.getAdjustedFileName(fileName, uploadType);

    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes,
      contentType: mimeType,
    } as GetSignedUrlConfig;

    const res = await this.storage
      .bucket(this.bucket)
      .file(destination)
      .getSignedUrl(options);

    return { url: res[0], destination: destination };
  }

  async uploadFile(
    fileName: string,
    uploadType: UPLOAD_TYPE,
    buffer: Buffer,
    mimeType: string
  ) {
    try {
      const destination = this.getAdjustedFileName(fileName, uploadType);

      const fileCloud = this.storage.bucket(this.bucket).file(destination);

      await fileCloud.save(buffer, {
        contentType: mimeType,
      });

      return destination;
    } catch (e) {
      console.log('Upload Error', e);
      throw new UploadFailedError();
    }
  }

  async getSignedURL(filePath: string) {
    const options = {
      version: 'v4',
      action: 'read',
      expires:
        Date.now() +
        (filePath.includes('videos') || filePath.includes('audios')
          ? PLAYABLE_MEDIA_EXPIRATION
          : STATIC_MEDIA_EXPIRATION),
    } as GetSignedUrlConfig;

    const res = await this.storage
      .bucket(this.bucket)
      .file(filePath)
      .getSignedUrl(options);

    return res[0];
  }

  async duplicateFile(filePath: string, uploadType?: UPLOAD_TYPE) {
    const destination = this.getAdjustedFileName(filePath, uploadType);
    const res = await this.storage
      .bucket(this.bucket)
      .file(filePath)
      .copy(destination);

    return destination;
  }

  async deleteFile(filePath: string) {
    const res = await this.storage.bucket(this.bucket).file(filePath).delete();

    return res;
  }
}

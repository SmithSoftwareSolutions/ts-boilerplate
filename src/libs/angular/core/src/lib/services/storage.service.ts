import { UPLOAD_TYPE } from '@org/nest/storage/objects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { environment } from '../environments/environment';
import { httpOptions } from './base-resource.service';

@Injectable()
export class StorageService {
  constructor(protected readonly http: HttpClient) {}

  uploadFile(file: File, type: UPLOAD_TYPE = UPLOAD_TYPE.DEFAULT) {
    return this.http
      .get<{ url: string; destination: string }>(
        `${environment.storageService}/upload-url/${type}/${file.name}`,
        {
          params: { mimeType: file.type },
          ...httpOptions,
        }
      )
      .pipe(
        switchMap((res: { url: string; destination: string }) =>
          this.http
            .put(`${res.url}`, file, {
              headers: {
                'Content-Type': file.type,
              },
            })
            .pipe(map(() => ({ path: res.destination })))
        )
      );
  }

  getFreshURL(path: string) {
    return this.http.get<{ url: string }>(
      `${environment.storageService}/${path}`,
      {
        ...httpOptions,
      }
    );
  }

  duplicateFile(filePath: string, uploadType?: UPLOAD_TYPE) {
    return this.http.post(
      `${environment.storageService}/duplicate/${filePath}`,
      { uploadType },
      {
        ...httpOptions,
      }
    );
  }

  deleteFile(filePath: string) {
    return this.http.delete(`${environment.storageService}/${filePath}`, {
      ...httpOptions,
    });
  }
}

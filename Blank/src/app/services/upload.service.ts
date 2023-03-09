import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  public upload$: BehaviorSubject<any> = new BehaviorSubject(false);
  CLOUDINARY_URL = `${environment.CLOUDINARY_URL}/${environment.cloud_name}/upload`;

  async uploadImage(file: File) {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', environment.cloud_preset);
      formData.append('api_key', environment.api_key);
      formData.append('api_secret', environment.api_secret);
      formData.append('folder', 'chatpp');
      this.upload$.next(true);
      this.http
        .post(this.CLOUDINARY_URL, formData, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            return res.secure_url;
          },
          error: (err: any) => {
            console.log(err);
            this.upload$.next(false);
          },
        });
    }
  }
}

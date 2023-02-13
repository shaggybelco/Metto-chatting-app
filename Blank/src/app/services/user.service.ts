import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${environment.cloud_name}/upload`;
  public upload$: BehaviorSubject<any> = new BehaviorSubject(false);

  getUsers(id: any): Observable<any> {
    return this.http.get(`${environment.baseUrl}/users/${id}`);
  }

  getUsersWithLastMessage(data: any): Observable<any> {
    return this.http.get(`${environment.baseUrl}/userm/${data}`);
  }

  getMe(userId: any): Observable<any> {
    return this.http.get(`${environment.baseUrl}/me/${userId}`);
  }

  updateProfile(data: any, file: any): Observable<any> {
    return this.http.put(`${environment.baseUrl}/updatepp/${data.id}`, file);
  }

  async uploadImage(file: File, data: any) {
    this.upload$.next(true);
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', environment.cloud_preset);
      formData.append('api_key', environment.api_key);
      formData.append('api_secret', environment.api_secret);
      formData.append('folder', 'chatpp');

      this.http
        .post(this.CLOUDINARY_URL, formData, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        })
        .subscribe(
          (res: any) => {
            console.log(res);

            const After = {
              ...data,
              image: res.secure_url,
            };

            this.http
              .put(`${environment.baseUrl}/updatepp/${data.id}`, After)
              .subscribe(
                (updated: any) => {
                  console.log(updated);
                  this.upload$.next(false);
                },
                (err: any) => {
                  console.log(err);
                }
              );
          },
          (err: any) => {
            console.log(err);
            this.upload$.next(false);
          }
        );
    } else {
      console.log('no file')
      this.http
        .put(`${environment.baseUrl}/updatepp/${data.id}`, data)
        .subscribe(
          (updated: any) => {
            console.log(updated);
            this.upload$.next(false);
          },
          (err: any) => {
            console.log(err);
            this.upload$.next(false);
          }
        );
    }
  }
  
}

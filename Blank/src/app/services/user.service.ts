import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  CLOUDINARY_URL = `${environment.CLOUDINARY_URL}/${environment.cloud_name}/upload`;
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

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${environment.baseUrl}/updatepp/${data.id}`, data);
  }

  getMembers(userId: any): Observable<any> {
    return this.http.get(`${environment.baseUrl}/groupmembers/${userId}`);
  }

  getGroup(userId: any): Observable<any> {
    return this.http.get(`${environment.baseUrl}/group/${userId}`);
  }

  async uploadImage(data: any, file?: File) {
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

            const After = {
              ...data,
              image: res.secure_url,
            };

            this.updateProfile(After).subscribe({
              next: (updated: any) => {
                this.upload$.next(false);
                console.log(updated);
              },
              error: (error: any) => {
                this.upload$.next(false);
                console.log(error);
              },
            });
          },
          error: (err: any) => {
            console.log(err);
            this.upload$.next(false);
          },
        });
    } else {
      this.updateProfile(data).subscribe({
        next: (updated: any) => {
          this.upload$.next(false);
          console.log(updated);
        },
        error: (error: any) => {
          this.upload$.next(false);
          console.log(error);
        },
      });
    }
  }
}

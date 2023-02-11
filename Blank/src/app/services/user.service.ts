import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(id: any):Observable<any>{
    return this.http.get(`${environment.baseUrl}/users/${id}`);
  }

  getUsersWithLastMessage(data: any): Observable<any>{
    return this.http.get(`${environment.baseUrl}/userm/${data}`);
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(data: any): Observable<User>{
    return this.http.post<User>(`${environment.baseUrl}/reg`, data)
  }

  signin(data: any): Observable<any>{
    return this.http.post(`${environment.baseUrl}/log`, data)
  }

  checkUser(data: any): Observable<any>{
    return this.http.post(`${environment.baseUrl}/logs`, data)
  }

}

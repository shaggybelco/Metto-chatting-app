import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  getMessages(data: any): Observable<any> {
    return this.http.get(`${environment.baseUrl}/messages/${data.me}/${data.receiver}`, data);
  }

  send(data: any): Observable<any>{
    return this.http.post(`${environment.baseUrl}/messages/${data.me}/${data.otherId}`, data)
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PhotoService } from './photo.service';
import { io } from "socket.io-client";

const socket = io(`${environment.base}`);

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  private statusSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private photoService: PhotoService) {
    socket.on('status', (data) => {
      this.statusSubject.next(data);
      console.log(data)
    });
  }
  public message$: BehaviorSubject<any> = new BehaviorSubject({});
  public typying$: BehaviorSubject<any> = new BehaviorSubject(false);
  public otherUserID$: BehaviorSubject<any> = new BehaviorSubject(false);
  public countUnread$: BehaviorSubject<number> = new BehaviorSubject(0);

  connect(id: any) {
    socket.on("connect", () => {
      socket.emit('connected', id);
      console.log(socket.id)
    });
  }

  unreadCount = 0;
  setUnreadCount(unread: number){
    this.countUnread$.next(unread);
    this.unreadCount = unread;
  }

  getUnreadCount(){
    return this.unreadCount
  }

  getStatus() {
    return this.statusSubject.asObservable();
  }

  public isScrolledToBottom = false;

  public getNewMessage = () => {
    socket.on('mesRec', (message) => {
      console.log(message)
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };

  listenToTyping(): Observable<any> {
    socket.on('typing', (username: string) => {
      console.log(username + ' is typing...');
      this.typying$.next(true);
      this.otherUserID$.next(username);
      setTimeout(() => {
        this.typying$.next(false);
      }, 10000);
    });

    return this.typying$.asObservable();
  }

  getMessages(data: any, page: number): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/messages/${data.me}/${data.receiver}?page=${page}`,
      data
    );
  }

  startTyping(data: any) {
    socket.emit('typing', data);
  }

  send(data: any) {
    socket.emit('send', data);

    // return this.http.post(
    //   `${environment.baseUrl}/messages/${data.me}/${data.otherId}`,
    //   data
    // );
  }

  public upload$: BehaviorSubject<any> = new BehaviorSubject(false);
  CLOUDINARY_URL = `${environment.CLOUDINARY_URL}/${environment.cloud_name}/upload`;

  async uploadImage(data: any, files?: any) {
    this.upload$.next(true);
    if (files) {
      const formData = new FormData();
      formData.append('file', files);
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
        .subscribe({
          next: (res: any) => {
            console.log(res);

            const After = {
              ...data,
              file: res.secure_url,
            };
            console.log(After);
            this.upload$.next(true);

            this.send(After);
          },
          error: (err: any) => {
            console.log(err);
            this.upload$.next(false);
          },
        });
    } else {
      this.upload$.next(true);
      this.send(data);
    }
  }
}

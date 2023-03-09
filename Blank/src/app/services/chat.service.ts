import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PhotoService } from './photo.service';
import { io, Socket } from "socket.io-client";

// const socket = io(`${environment.base}`);

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket!: Socket;

  private statusSubject = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private photoService: PhotoService) {
    this.socket = io(`${environment.base}`);
    this.socket.on('status', (data) => {
      this.statusSubject.next(data);
    });
  }
  public message$: BehaviorSubject<any> = new BehaviorSubject({});
  public typying$: BehaviorSubject<any> = new BehaviorSubject(false);
  public otherUserID$: BehaviorSubject<any> = new BehaviorSubject(false);
  public countUnread$: BehaviorSubject<number> = new BehaviorSubject(0);

  connect(id: any) {
    this.socket.on("connect", () => {
      this.socket.emit('connected', id);
      console.log(this.socket.id)
    });
  }

  getSocket(): Socket {
    return this.socket;
  }

  createGroup(group: any) {
    return this.http.get(`${environment.base}/api/create`, group);
  }

  unreadCount = 0;
  setUnreadCount(unread: number){
    this.countUnread$.next(unread);
    this.unreadCount = unread;
  }

  getUnreadCount(){
    return this.countUnread$.asObservable();
  }

  getStatus() {
    return this.statusSubject.asObservable();
  }

  public isScrolledToBottom = false;

  public getNewMessage = () => {
    this.socket.on('mesRec', (message) => {
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };

  listenToTyping(): Observable<any> {
    this.socket.on('typing', (username: string) => {
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
    this.socket.emit('typing', data);
  }

  send(data: any) {
    this.socket.emit('send', data);

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

            const After = {
              ...data,
              file: res.secure_url,
            };
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

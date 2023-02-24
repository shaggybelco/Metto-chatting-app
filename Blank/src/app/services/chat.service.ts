import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PhotoService } from './photo.service';
import { io } from "socket.io-client";
import { Socket } from 'ngx-socket-io';


const socket = io(`http://localhost:3333`);

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient, private photoService: PhotoService, private sock: Socket) {}
  public message$: BehaviorSubject<any> = new BehaviorSubject({});

  connect(id: any){
    this.sock.on('connect', () => {
      this.sock.emit('connect', id);
      console.log('connected');
    })
    socket.on("connect", () => {
      socket.emit('connected', id);
      console.log(socket.id)
    });
  }

  public getNewMessage = () => {
    this.sock.on('mesRec', (message: any)=>{
      console.log(message)
      this.message$.next(message);
    })
    socket.on('mesRec', (message) =>{
      console.log(message)
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };

  getMessages(data: any): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}/messages/${data.me}/${data.receiver}`,
      data
    );
  }

  send(data: any): Observable<any> {
    // socket.emit('send', data);

    return this.http.post(
      `${environment.baseUrl}/messages/${data.me}/${data.otherId}`,
      data
    );
  }

  public upload$: BehaviorSubject<any> = new BehaviorSubject(false);
  CLOUDINARY_URL = `${environment.CLOUDINARY_URL}/${environment.cloud_name}/upload`;

  async uploadImage(data: any,files?: any) {
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

             socket.emit('send', data);


            // this.send(After).subscribe({
            //   next: (sent: any) => {
            //     console.log(sent);
                
            //     this.photoService.photos = [];
            //   },
            //   error: (err) => {
            //     console.log(err);
            //     this.upload$.next(false);
            //   },
            // });

            // return After;
          },
          error: (err: any) => {
            console.log(err);
            this.upload$.next(false);
          },
        });
    } else {
      console.log('no file');
      this.upload$.next(true);

       socket.emit('send', data);

      // this.send(data).subscribe({
      //   next: (sent: any) => {
      //     console.log(sent);
          
      //     this.photoService.photos = [];
      //   },
      //   error: (err) => {
      //     console.log(err);
      //     this.upload$.next(false);
      //   },
      // });

      // return data;
    }
  }
}

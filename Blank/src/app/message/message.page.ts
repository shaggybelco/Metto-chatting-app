import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ChatService } from '../services/chat.service';
import { TokenService } from '../services/token.service';
import { TransformService } from '../services/transform.service';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private token: TokenService,
    private chat: ChatService,
    public trans: TransformService,
    public photoService: PhotoService
  ) {}

  id = this.route.snapshot.params['id'];
  name = this.route.snapshot.params['name'];
  type = this.route.snapshot.params['type'];
  profile: string = '';
  haveAvatar = false;

  hold: any = this.token.decode();
  message: string = '';
  messages: any;
  isFile: boolean = false;
  @ViewChild(IonContent) content!: IonContent;

  scrollToBottom() {
    // Passing a duration to the method makes it so the scroll slowly
    // goes to the bottom instead of instantly
    this.content.scrollToBottom(500);
    // this.markAsRead();
  }

  scrollToTop() {
    // Passing a duration to the method makes it so the scroll slowly
    // goes to the top instead of instantly
    this.content.scrollToTop(500);
  }

  ngAfterViewChecked() {
    // this.chat.viewMessage();
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.getMessages();
  }

  addPhoto() {
    this.photoService.addNewToGallery();
  }

  dataUrl: any;
  ngDoCheck() {
    // console.log(this.photoService.photos);
    if (this.photoService.photos && this.photoService.photos.length > 0) {
      this.isFile = true;
      this.dataUrl = this.photoService.photos[0].webviewPath;
      // console.log(this.dataUrl);
    } else {
      this.isFile = false;
    }
  }
  getMessages() {
    const Data = {
      me: this.hold.id,
      receiver: this.id,
    };

    console.log(Data);

    this.chat.getMessages(Data).subscribe(
      (res: any) => {
        console.log(res);
        this.profile = res[0].receiver.avatar;
        this.haveAvatar = res[0].receiver.isAvatar;
        this.messages = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  input: any;
  files!: File;
  async openFileBrowser() {
    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.multiple = false;
    this.input.click();

    this.input.onchange = (e: any) => {
      this.files = this.input.files;
      console.log(this.files);
    };
  }

  send() {
    if (this.isFile) {
      this.isFile = true;
    } else {
      this.isFile = false;
    }

    const Data = {
      me: this.hold.id,
      otherId: this.id,
      message: this.message,
      recipient_type: this.type,
      isFile: this.isFile,
    };

    if (this.message !== '') {
      this.chat.uploadImage(this.dataUrl, Data);
    }else{
      return;
    }
    // console.log();
    // if (this.message !== '') {
    //   this.chat.send(Data).subscribe(
    //     (res: any) => {
    //       console.log(res);
    //     },
    //     (err: any) => {
    //       console.log(err);
    //     }
    //   );
    // } else {
    //   return;
    // }

    this.message = '';
  }
}

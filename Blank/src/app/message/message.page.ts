import { StorageService } from './../services/storage.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ChatService } from '../services/chat.service';
import { TokenService } from '../services/token.service';
import { TransformService } from '../services/transform.service';
import { PhotoService } from '../services/photo.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { StatusBar } from '@capacitor/status-bar';

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
    public photoService: PhotoService,
    private storage: StorageService
  ) {
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
    //  this.chat.getNewMessage().subscribe({
    //   next: (val: any) => {
    //     // console.log(val);
    //     this.message$.next(val);
    //   },
    // });
  }


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
  public image$: BehaviorSubject<any> = new BehaviorSubject('');

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

  subscription: Subscription = new Subscription();
  userSub: Subscription = new Subscription();
  userType: Subscription = new Subscription();
  public message$: BehaviorSubject<any> = new BehaviorSubject([]);

  ngOnInit(): void {
    this.chat.connect(this.hold.id);

    if (this.id) {
      this.getMessages();
    } else {
      this.getMessagesUsingInput();
    }
  }

  getMessagesUsingInput() {
    this.subscription = this.storage.currentMessage.subscribe((message: any) =>
      this.message$.next(
        message.sort(
          (
            a: { createdAt: string | number | Date },
            b: { createdAt: string | number | Date }
          ) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          }
        )
      )
    );

    this.userSub = this.storage.user.subscribe((user: any) => {
      console.log(user);
      this.profile = user.avatar;
      this.haveAvatar = user.isAvatar;
      this.name = user.name;
      this.id = user._id;
    });

    this.userType = this.storage.types.subscribe((types: any) => {
      console.log(types);
      this.type = types;
    });
  }

  addPhoto() {
    this.photoService.addNewToGallery();
  }

  dataUrl: any;
  ngDoCheck() {
    // console.log(this.photoService.photos);
    if (this.photoService.photos && this.photoService.photos.length > 0) {
      this.isFile = true;
      this.image$.next(this.photoService.photos);
      // this.dataUrl = this.photoService.photos[this.photoService.photos.length -1].webviewPath;
    } else {
      this.isFile = false;
      this.image$.next('');
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
        this.message$.next(res);
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
    const Data = {
      me: this.hold.id,
      otherId: this.id,
      recipient_type: this.type,
      message: this.message,
      isFile: this.isFile,
    };

    if (this.message !== '' || this.isFile === true) {
      const lng = this.photoService.photos.length;
      for (let i = 0; i < this.photoService.photos.length; i++) {
        if (this.photoService.photos.length === lng - 1) {
          const newData = {
            me: this.hold.id,
            otherId: this.id,
            message: this.message,
            recipient_type: this.type,
            isFile: this.isFile,
          };
          this.chat.uploadImage(
            newData,
            this.photoService.photos[i].webviewPath
          );
        }
        this.chat.uploadImage(Data, this.photoService.photos[i].webviewPath);
      }
    }
    console.log(this.isFile);
    if (this.message !== '' && this.isFile === false) {
      const newData = {
        me: this.hold.id,
        otherId: this.id,
        message: this.message,
        recipient_type: this.type,
        isFile: this.isFile,
      };
      console.log(newData);
      this.chat.uploadImage(newData);
      this.message = '';
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

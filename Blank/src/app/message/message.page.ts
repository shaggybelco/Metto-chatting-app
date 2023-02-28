import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  ScrollDetail,
} from '@ionic/angular';
import { ChatService } from '../services/chat.service';
import { TokenService } from '../services/token.service';
import { TransformService } from '../services/transform.service';
import { PhotoService } from '../services/photo.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { StatusBar } from '@capacitor/status-bar';
import { Message } from '../model/messages.model';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  typing: boolean = false;
  vals: any;

  constructor(
    private route: ActivatedRoute,
    private token: TokenService,
    private chat: ChatService,
    public trans: TransformService,
    public photoService: PhotoService
  ) {
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
    this.chat.listenToTyping().subscribe((val: any) => {
      // console.log(val)
      this.vals = val;
    });
  }

  id = this.route.snapshot.params['id'];
  name = this.route.snapshot.params['name'];
  type = this.route.snapshot.params['type'];
  profile: string = '';
  haveAvatar = false;

  hold: any = this.token.decode();
  message: string = '';
  messages: Message[] = [];
  isFile: boolean = false;
  @ViewChild('messagesContainer', { static: false })
  messagesContainer!: ElementRef;

  @ViewChild(IonContent, { static: true }) content!: IonContent;
  public image$: BehaviorSubject<any> = new BehaviorSubject('');

  scrollToTop() {
    // Passing a duration to the method makes it so the scroll slowly
    // goes to the top instead of instantly
    this.content.scrollToTop(500);
  }

  isScrolledToBottom: boolean = false;
  isLoading: boolean = false;
  showScrollDownButton: boolean = false;

  ngAfterViewChecked() {
    if (!this.isLoading) {
      if (this.isScrolledToBottom) {
        return;
      }
      this.scrollToBottom();
    }
  }

  resizeTextarea(event: any) {
    event.target.style.height = '20px';
    event.target.style.height = event.target.scrollHeight + 'px';

    if (event.target.value.length === 0) {
      event.target.style.height = '24px';
    }
  }

  handleScroll(ev: CustomEvent<ScrollDetail>) {
    // console.log('scroll', ev.detail);
    // console.log(ev);
    if (ev.detail.currentY <= 150) {
      this.showScrollDownButton = true;
    } else {
      this.showScrollDownButton = false;
    }
  }

  slowScrollToBottom() {
    this.content.scrollToBottom(300);
  }

  scrollToBottom() {
    this.content.scrollToBottom(0);
    this.isScrolledToBottom = true;
  }

  subscription: Subscription = new Subscription();
  userSub: Subscription = new Subscription();
  userType: Subscription = new Subscription();
  public message$: BehaviorSubject<any> = new BehaviorSubject([]);

  ngOnInit(): void {
    this.chat.connect(this.hold.id);
    this.getMessages();
    this.chat.getNewMessage().subscribe({
      next: (val: Message[]) => {
        console.log(val);
        this.message$.next(
          val.sort((a: Message, b: Message) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          })
        );
      },
    });
  }

  startTyping() {
    this.chat.startTyping({
      receiver: this.id,
      message: this.message,
      sender: this.hold.id,
    });
    this.typing = true;
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
      for (let index = 0; index < this.photoService.photos.length; index++) {

        const indexP = this.holdingFiles.indexOf(this.photoService.photos[index]);
        console.log(indexP);
        if (indexP > -1) {
          return;
        }
        this.holdingFiles.push(this.photoService.photos[index]);
      }
      // this.dataUrl = this.photoService.photos[this.photoService.photos.length -1].webviewPath;
    } else {
      this.isFile = false;
      this.image$.next('');
    }
  }

  page = 1;

  onIonInfinite(ev?: any) {
    this.page++;
    this.getMessages();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  removeItem(item: string) {
    const index = this.holdingFiles.indexOf(item);
    console.log(index);
    if (index > -1) {
      this.holdingFiles.splice(index, 1);
    }
  }

  isSelected(item: string): boolean {
    return this.holdingFiles.includes(item);
  }

  getMessages() {
    this.isLoading = true;
    const messageQueryParams = {
      me: this.hold.id,
      receiver: this.id,
    };

    // console.log(messageQueryParams);

    this.chat.getMessages(messageQueryParams, this.page).subscribe({
      next: (res: any) => {
        console.log(res);

        for (const message of res) {
          this.messages.unshift(message);
        }

        this.message$.next(this.messages);
        this.profile = this.messages[0].receiver.avatar;
        this.haveAvatar = this.messages[0].receiver.isAvatar;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = true;
        // Handle the error properly, e.g. show a message to the user
      },
    });
  }

  input: any;
  files!: File[];
  holdingFiles: any = [];
  flag = false;
  async openFileBrowser() {
    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.multiple = true;
    this.input.accept = 'image/*';
    this.input.click();

    let currentIndex = 0;

    this.input.onchange = (e: any) => {
      this.files = this.input.files;
      console.log(this.files);

      if (this.files.length > 0) {
        this.isFile = true;
      }
      const reader = new FileReader();

      reader.onloadend = () => {

        const file = this.files![currentIndex];
        const dataUrl = reader.result as string;
        const fileName = file.name;
        console.log(fileName)
        const fileExtension = fileName && fileName.length > 0 ? fileName?.split('.')?.pop()?.toLowerCase() : '';
        const isImage = ['jpg', 'jpeg', 'gif', 'png', 'webp'].includes(fileExtension!);
        if (!isImage) {
          alert('Invalid file type. Please select an image file.');
          return;
        }


        currentIndex++;

        // console.log(dataUrl);
        this.holdingFiles.push({ img: dataUrl, name: file.name });
        console.log(this.holdingFiles);

        if (currentIndex < this.files!.length) {
          reader.readAsDataURL(this.files![currentIndex]);
        }

        this.image$.next(this.holdingFiles);
        console.log(this.image$.getValue());
      };


      reader.readAsDataURL(this.files[0]);
    };

  }

  send() {
    const Data = {
      me: this.hold.id,
      otherId: this.id,
      recipient_type: this.type,
      message: this.message,
      isFile: this.isFile,
      page: this.page,
    };

    let isFile = false;

    if(this.holdingFiles.length > 0){
      isFile = true
    }else{
      isFile = false;
    }

    console.log(isFile);

    if (this.message !== '' || isFile === true) {
      const lng = this.holdingFiles.length;
      for (let i = 0; i < this.holdingFiles.length; i++) {
        if (this.holdingFiles.length === lng - 1) {
          const newData = {
            me: this.hold.id,
            otherId: this.id,
            message: this.message,
            recipient_type: this.type,
            isFile: isFile,
          };
          this.chat.uploadImage(
            newData,
            this.holdingFiles[i].img
          );
        }
        this.chat.uploadImage(Data, this.holdingFiles[i].img);
      }
    }
   
    if (this.message !== '' && isFile === false) {
      const newData = {
        me: this.hold.id,
        otherId: this.id,
        message: this.message,
        recipient_type: this.type,
        isFile: isFile,
      };
      console.log(newData);
      this.chat.uploadImage(newData);
      this.message = '';
    }

    this.message = '';
    // this.scrollToBottom();
  }

  ngOnDestroy() {
    this.isScrolledToBottom = false;
  }
}

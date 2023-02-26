import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { TransformService } from '../services/transform.service';
import { StatusBar } from '@capacitor/status-bar';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chats-tab',
  templateUrl: './chats-tab.page.html',
  styleUrls: ['./chats-tab.page.scss'],
})
export class ChatsTabPage implements OnInit {
  constructor(
    private token: TokenService,
    private user: UserService,
    public trans: TransformService,
    public storage: StorageService,
    private chat: ChatService
  ) {
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
  }

  public load$: BehaviorSubject<any> = new BehaviorSubject(false);
  hold: any;
  users: any = [];
  us: any;

  ngAfterViewChecked() {
    this.chat.isScrolledToBottom = false;
    console.log(this.chat.isScrolledToBottom)
  }

  private userSource = new BehaviorSubject<any[]>([]);
  users$ = this.userSource.asObservable();
  ngOnInit() {
    this.hold = this.token.decode();
    this.chat.connect(this.hold.id);
    if (this.storage.get('users') === null) {
      this.getUsersWithLastMessage();
    } else {
      this.users = this.storage.get('users');
    }

    this.chat.getNewMessage().subscribe((res: any) => {
      console.log(res);

      this.user.getUsersWithLastMessage(this.hold.id).subscribe({
        next: (users: any) => {
          this.users = users.lastMessages;
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {},
      });
    });
  }

  getUsersWithLastMessage() {
    this.load$.next(true);
    this.user.getUsersWithLastMessage(this.hold.id).subscribe(
      (res: any) => {
        console.log(res.lastMessages);
        this.users = res.lastMessages;
        this.storage.set('users', this.users);
        this.load$.next(false);
      },
      (err: any) => {
        console.log(err);
        this.load$.next(false);
      }
    );
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.getUsersWithLastMessage();
      event.target.complete();
    }, 2000);
  }
}

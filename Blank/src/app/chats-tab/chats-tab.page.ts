import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { TransformService } from '../services/transform.service';
import { StatusBar } from '@capacitor/status-bar';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from '../services/storage.service';

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
    public storage: StorageService
  ) {
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
  }

  public load$: BehaviorSubject<any> = new BehaviorSubject(false);
  hold: any;
  users: any = [];
  us: any;

  private userSource = new BehaviorSubject<any[]>([]);
  users$ = this.userSource.asObservable();
  ngOnInit() {
    this.hold = this.token.decode();

    if (this.storage.get('users') === null) {
      alert('no users');
      this.getUsersWithLastMessage();
    } else {
      alert('users already');
      this.users = this.storage.get('users');
    }
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

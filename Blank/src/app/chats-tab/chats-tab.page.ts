import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { TransformService } from '../services/transform.service';

@Component({
  selector: 'app-chats-tab',
  templateUrl: './chats-tab.page.html',
  styleUrls: ['./chats-tab.page.scss'],
})
export class ChatsTabPage implements OnInit {
  constructor(
    private token: TokenService,
    private user: UserService,
    public trans: TransformService
  ) {}

  hold: any;
  users: any;
  ngOnInit() {
    this.hold = this.token.decode();
    this.getUsersWithLastMessage();
  }

  getUsersWithLastMessage() {
    this.user.getUsersWithLastMessage(this.hold.id).subscribe(
      (res: any) => {
        console.log(res.lastMessages);
        this.users = res.lastMessages;
      },
      (err: any) => {
        console.log(err);
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

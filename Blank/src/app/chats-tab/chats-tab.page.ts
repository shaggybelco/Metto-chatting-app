import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chats-tab',
  templateUrl: './chats-tab.page.html',
  styleUrls: ['./chats-tab.page.scss'],
})
export class ChatsTabPage implements OnInit {
  constructor(private token: TokenService, private user: UserService) {}

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

      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}

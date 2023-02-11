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
  };

  transform(date: string) {
    if (!date) {
      return 'a long time ago';
    }
    let time = (Date.now() - Date.parse(date)) / 1000;
    if (time < 10) {
      return 'just now';
    } else if (time < 60) {
      return 'a second ago';
    }
    const divider = [60, 60, 24, 30, 12];
    const string = [' second', ' minute', ' hour', ' day', ' month', ' year'];
    let i;
    for (i = 0; Math.floor(time / divider[i]) > 0; i++) {
      time /= divider[i];
    }
    const plural = Math.floor(time) > 1 ? 's' : '';
    if (i === 3) {
      const dateObject = new Date(Date.parse(date));
      return dateObject.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return Math.floor(time) + string[i] + plural + ' ago';
  }
}

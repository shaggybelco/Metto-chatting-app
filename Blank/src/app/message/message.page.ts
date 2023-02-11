import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../services/chat.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private token: TokenService,
    private chat: ChatService
  ) {}

  id = this.route.snapshot.params['id'];
  name = this.route.snapshot.params['name'];
  hold: any = this.token.decode();
  message: string = '';
  messages: any;


  ngOnInit(): void {
    this.getMessages();
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
        this.messages = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  send() {
    const Data = {
      me: this.hold.id,
      otherId: this.id,
      message: this.message,
      recipient_type: 'user'
    };

    console.log(this.message);
    if (this.message !== '') {
      this.chat.send(Data).subscribe(
        (res: any) => {
          console.log(res);
        },
        (err: any) => {
          console.log(err);
        }
      );
    } else {
      return;
    }

    this.message = '';
  }
}

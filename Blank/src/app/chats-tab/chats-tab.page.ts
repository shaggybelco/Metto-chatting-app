import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-chats-tab',
  templateUrl: './chats-tab.page.html',
  styleUrls: ['./chats-tab.page.scss'],
})
export class ChatsTabPage implements OnInit {

  constructor(private token: TokenService) { }

  hold: any;
  ngOnInit() {
    this.hold = this.token.decode();
  }

}

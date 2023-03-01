import { StorageService } from './../services/storage.service';
import { TransformService } from './../services/transform.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';
import { last } from 'rxjs';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  hold: any;
  vals: any;
  otherUserID: string = '';

  constructor(
    public trans: TransformService,
    private token: TokenService,
    private route: Router,
    private storage: StorageService,
    public chat: ChatService
  ) {
    this.chat.listenToTyping().subscribe((val: any) => {
      // console.log(val)
      this.vals = val;
    });

    this.chat.otherUserID$.subscribe((val: string) => {
      // console.log(val)
      this.otherUserID =  val;
    })
  }

  @Input() userList!: any;

  ngOnInit(): void {
    this.hold = this.token.decode();
  }

  ngDoCheck() {
    // console.log(this.userList);
  }

  goToMessage(id: string, name: string, type: string, i: number) {
    console.log(id, name, type);
    console.log(this.userList[i]?.filteredMessages?.reverse());
    this.storage.changeMessage(
      this.userList[i]?.filteredMessages,
      this.userList[i].receiver,
      this.userList[i].lastMessage.recipient_type
    );
    this.route.navigate(['/message', id, name, type]);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.storage.set('users', this.userList);
  }
}

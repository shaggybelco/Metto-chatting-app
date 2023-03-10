import { StorageService } from '../../services/storage.service';
import { TransformService } from '../../services/transform.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  hold: any;
  vals: any;
  otherUserID: string = '';
  status: any = [];

  constructor(
    public trans: TransformService,
    private token: TokenService,
    private route: Router,
    private storage: StorageService,
    public chat: ChatService
  ) {
    this.hold = this.token.decode();
    this.chat.listenToTyping().subscribe((val: any) => {
      this.vals = val;
    });


    this.chat.otherUserID$.subscribe((val: string) => {
      this.otherUserID = val;
    })

    chat.getStatus().subscribe((status: any) => {
      this.status = status.users;
      console.log(status);
      
    })

  }

  @Input() userList!: any;


  ngOnInit(): void {
    this.hold = this.token.decode();
  }

  isUserOnline(userID: string): boolean {
    return this.status?.indexOf(userID) !== -1;
  }

  goToMessage(id: string, name: string, type: string, i: number) {
    this.storage.changeMessage(
      this.userList[i]?.filteredMessages,
      this.userList[i].receiver,
      this.userList[i].lastMessage.recipient_type
    );
    this.route.navigate(['/message', id, name, type]);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const msg of this.userList) {
      // console.log(msg);
      
    }
    this.storage.set('users', this.userList);
  }
}

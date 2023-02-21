import { StorageService } from './../services/storage.service';
import { TransformService } from './../services/transform.service';
import { Component, Input, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit {
  hold: any;

  constructor(
    public trans: TransformService,
    private token: TokenService,
    private route: Router,
    private storage: StorageService
  ) {}

  @Input() userList!: any;

  ngOnInit(): void {
    this.hold = this.token.decode();
  }

  // ngDoCheck() {
  //   console.log(this.userList);
  // }

  goToMessage(id: string, name: string, type: string, i: number) {
    console.log(id, name, type);
    console.log(this.userList[i]?.filteredMessages?.reverse());
    this.storage.changeMessage(this.userList[i]?.filteredMessages?.reverse());
    this.route.navigate(['/message', id, name, type]);
  }
}

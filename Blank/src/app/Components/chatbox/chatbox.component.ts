import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Message } from 'src/app/model/messages.model';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {

  constructor() { }

  @ViewChild(IonContent, { static: true }) content!: IonContent;
  @Input() chat!: Message;
  @Input() current_user_id: any;
  slowScrollToBottom() {
    this.content.scrollToBottom(300);
  }

  ngAfterViewChecked(){
    // this.slowScrollToBottom();
  }

  ngOnInit() { }

}

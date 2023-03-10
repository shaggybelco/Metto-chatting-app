import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  myData: any;

  constructor(private chat: ChatService) { }

  @Input() tab = 'list';

  setActiveTab(selectedTab: string) {
    this.tab = selectedTab;
  }

  ngOnInit() {
    this.myData = this.chat.getUnreadCount();
  }

  ngAfterViewChecked() {
    // console.log(this.chat.getUnreadCount())
    // setTimeout(() => {
      this.chat.getUnreadCount().subscribe(count => this.myData = count);
    // }, 0);
   
  }

  ngDoCheck(){
    this.chat.getUnreadCount().subscribe(count => this.myData = count);
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor() { }

  @Input() tab = '';

  setActiveTab(selectedTab: string) {
    this.tab = selectedTab;
  }

  ngOnInit(): void {
  }

}

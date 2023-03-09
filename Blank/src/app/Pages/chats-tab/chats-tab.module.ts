import { ChatListComponent } from '../../Components/chat-list/chat-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsTabPageRoutingModule } from './chats-tab-routing.module';

import { ChatsTabPage } from './chats-tab.page';
import { } from '../../Components/chat-list/chat-list.component'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsTabPageRoutingModule
  ],
  declarations: [ChatsTabPage, ChatListComponent],
  exports: [ ChatListComponent]
})
export class ChatsTabPageModule {}

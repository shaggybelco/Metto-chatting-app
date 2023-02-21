import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagePageRoutingModule } from './message-routing.module';

import { MessagePage } from './message.page';
import { ChatsTabPageModule } from '../chats-tab/chats-tab.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagePageRoutingModule,
    FormsModule,
    ChatsTabPageModule
  ],
  declarations: [MessagePage]
})
export class MessagePageModule {}

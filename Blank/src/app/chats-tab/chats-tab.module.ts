import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsTabPageRoutingModule } from './chats-tab-routing.module';

import { ChatsTabPage } from './chats-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsTabPageRoutingModule
  ],
  declarations: [ChatsTabPage]
})
export class ChatsTabPageModule {}

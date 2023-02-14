import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewChatPageRoutingModule } from './new-chat-routing.module';

import { NewChatPage } from './new-chat.page';
import {ContactTabPageModule} from '../contact-tab/contact-tab.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewChatPageRoutingModule,
    ContactTabPageModule
  ],
  declarations: [NewChatPage]
})
export class NewChatPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactTabPageRoutingModule } from './contact-tab-routing.module';

import { ContactTabPage } from './contact-tab.page';
import {ContactsComponent} from '../contacts/contacts.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactTabPageRoutingModule,
  
  ],
  declarations: [ContactTabPage, ContactsComponent],
  exports: [ContactsComponent]
})
export class ContactTabPageModule {}

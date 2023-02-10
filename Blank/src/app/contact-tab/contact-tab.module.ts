import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactTabPageRoutingModule } from './contact-tab-routing.module';

import { ContactTabPage } from './contact-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactTabPageRoutingModule
  ],
  declarations: [ContactTabPage]
})
export class ContactTabPageModule {}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Contacts } from '@capacitor-community/contacts';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {
  constructor(private user: UserService, private token: TokenService) {}
  hold: any = this.token.decode();
  contactsDatabase: any = [];

  ngOnInit() {
    this.retrieveListOfContacts();
    this.user.getUsers('63e68fd1a77a5619c9057c27').subscribe((res: any) => {
      console.log(res);
      this.contactsDatabase = res;
    });
  }

  contacts: any = [];

  retrieveListOfContacts = async () => {
    const projection = {
      // Specify which fields should be retrieved.
      name: true,
      phones: true,
      postalAddresses: true,
    };

    const result = await Contacts.getContacts({
      projection,
    });

    // Iterate over the contacts retrieved from the device's database
    for (const contact of result.contacts) {
      // Get the name and phone number of the current contact
      const { name, phones } = contact;

      // Check if the contact has any phone numbers associated with it
      if (phones && phones.length > 0) {
        // Normalize the phone number by removing the '27' prefix
        let phone = phones?.[0].number?.replace(/\D/g, '');
        if (phone?.startsWith('27')) {
          phone = phone.slice(2);
        } else if (phone?.startsWith('0')) {
          phone = phone.slice(1);
        }

        // Iterate over the contacts in your database
        for (const dbContact of this.contactsDatabase) {
          // Compare the name and normalized phone number of the current contact with those in your database
          if (phone === dbContact.cellphone.toString()) {
            console.log(`Match found: ${phone}`);
            this.contacts.push({name, phone})
            // Perform some action based on the match, such as updating information in your database
          }
        }
      }
    }
    console.log(this.contacts)
  };


   @ViewChild(IonModal)
  modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  desc!: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }
}

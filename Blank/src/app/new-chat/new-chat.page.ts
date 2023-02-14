import { Component, OnInit, ViewChild } from '@angular/core';
import { Contacts } from '@capacitor-community/contacts';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {
  constructor(
    private user: UserService,
    private token: TokenService,
    private route: ActivatedRoute
  ) {
    this.contactSubject = new BehaviorSubject<any[]>([]);
    this.contacts$ = this.contactSubject.asObservable();
  }
  hold: any = this.token.decode();
  contactsDatabase: any = [];

  ngOnInit() {
    // this.retrieveListOfContacts();
    //   this.user.getUsers(this.hold.id).subscribe((res: any) => {
    //     console.log(res);
    //     this.contactsDatabase = res;
    //   });
    this.route.paramMap.subscribe(params => {
      // Do any re-initialization here
      console.log('Component re-initialized');
      this.retrieveListOfContacts();
      this.user.getUsers(this.hold.id).subscribe((res: any) => {
        console.log(res);
        this.contactsDatabase = res;
      });
    });
  }

  contacts$!: Observable<any[]>;
  private contactSubject!: BehaviorSubject<any[]>;

  contacts: any = [];
  notRegistered: any = [];


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

    this.notRegistered = result.contacts;

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
            alert(`Match found: ${phone}`);
            let newContact = {name, phone};
            // this.contacts.push({ name, phone });
            let currentContacts = this.contactSubject.getValue();
            this.contactSubject.next([...currentContacts, newContact]);
            // Perform some action based on the match, such as updating information in your database
          }
        }
      }
    }
  };

  @ViewChild(IonModal)
  modal!: IonModal;

  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
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

  file: any;
  input: any;
  isAvatar: boolean = false;
  dataUrl: any;

  async openFileBrowser() {
    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.click();

    this.input.onchange = (e: any) => {
      this.file = this.input.files[0];
      console.log(this.file);

      const reader = new FileReader();

      reader.onloadend = () => {
        this.dataUrl = reader.result;
      };

      reader.readAsDataURL(this.file);
    };
  }
}

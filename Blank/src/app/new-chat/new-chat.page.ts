import { Component, OnInit, ViewChild } from '@angular/core';
import { Contacts } from '@capacitor-community/contacts';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

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
    this.user.getUsers(this.hold.id).subscribe((res: any) => {
      console.log(res);
      this.contactsDatabase = res;
      this.retrieveListOfContacts();
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here

      this.user.getUsers(this.hold.id).subscribe((res: any) => {
        console.log(res);
        this.contacts = [];
        this.contactSubject.next(this.contacts);
        this.contactsDatabase = res;
        this.retrieveListOfContacts();
      });
      event.target.complete();
    }, 2000);
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
        for (const oneOne of phones) {
          let one = oneOne?.number?.replace(/\D/g, '');
          if (oneOne?.number?.startsWith('27')) {
            one = one?.slice(2);
          }
          if (oneOne?.number?.startsWith('0')) {
            one = one?.slice(1);
          }

          const filteredContacts = this.contactsDatabase.filter(
            (dbContact: any) => dbContact.cellphone.toString() === one
          );
          if (filteredContacts.length > 0) {
            this.contacts.push({ db: filteredContacts[0], oneOne, name });
            this.contactSubject.next(this.contacts);
          }
        }
      }
    }

    this.notRegistered = result.contacts.filter((contact) => {
      return !this.contacts.some(
        (reg: any) =>
          reg.oneOne.number?.replace(/\D/g, '') ===
          contact?.phones?.[0]?.number?.replace(/\D/g, '')
      );
    });

    this.contacts.sort(
      (a: { name: { display: string } }, b: { name: { display: any } }) =>
        a.name.display.localeCompare(b.name.display)
    );

    this.notRegistered.sort(
      (a: { name: { display: string } }, b: { name: { display: any } }) =>
        a.name.display.localeCompare(b.name.display)
    );
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

import { Component, OnInit } from '@angular/core';
import { Contacts } from '@capacitor-community/contacts';
import { StatusBar } from '@capacitor/status-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-contact-tab',
  templateUrl: './contact-tab.page.html',
  styleUrls: ['./contact-tab.page.scss'],
})
export class ContactTabPage implements OnInit {

  constructor(
    private user: UserService,
    private token: TokenService,
  ) {
    this.contactSubject = new BehaviorSubject<any[]>([]);
    this.contacts$ = this.contactSubject.asObservable();
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
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
}

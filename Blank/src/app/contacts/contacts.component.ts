import { StorageService } from './../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { Contacts } from '@capacitor-community/contacts';
import { StatusBar } from '@capacitor/status-bar';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  constructor(
    private user: UserService,
    private token: TokenService,
    private platform: Platform  ) {
    this.contactSubject = new BehaviorSubject<any[]>([]);
    this.contacts$ = this.contactSubject.asObservable();
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
  }
  hold: any = this.token.decode();
  contactsDatabase: any = [];
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    // this.getUsers();
    this.getContactsFromCache();
  }
  
  clearSessionStorage() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      window.localStorage.clear();
      alert('Cleared sessionStorage');
    }
  }

  async getContactsFromCache() {
    const contacts = localStorage.getItem('contacts');
    const timestamp = localStorage.getItem('contacts_timestamp');

    const filteredContacts = localStorage.getItem('filtered');
    const filteredTimestamp = localStorage.getItem('filtered_timestamp');

    if (filteredContacts && filteredTimestamp) {
      const lastUpdated: any = new Date(filteredTimestamp);
      const now: any = new Date();
      const hoursElapsed = Math.abs(now - lastUpdated) / 36e5;
      if (hoursElapsed > 24) {
        await this.retrieveListOfContacts();
      } else {
        this.notRegistered = JSON.parse(filteredContacts);
        // this.contactSubject.next(this.contacts);
      }
    } else {
      await this.getUsers();
    }

    if (contacts && timestamp) {
      const lastUpdated: any = new Date(timestamp);
      const now: any = new Date();
      const hoursElapsed = Math.abs(now - lastUpdated) / 36e5;
      if (hoursElapsed > 24) {
        await this.retrieveListOfContacts();
      } else {
        this.contacts = JSON.parse(contacts);
        this.contactSubject.next(this.contacts);
      }
    } else {
      await this.getUsers();
    }
  }

  async getUsers() {
    this.loading$.next(true);
    this.user
      .getUsers(this.hold.id)
      .pipe(
        tap((res: any) => {
          console.log(res);
          this.contactsDatabase = res;
        })
      )
      .subscribe(() => {
        this.retrieveListOfContacts();
        this.loading$.next(false);
      });
  }

  handleRefresh(event: any) {
    // this.zone.runOutsideAngular(() => {
    setTimeout(() => {
      // Any calls to load data go here
      this.contacts =[]

      this.getUsers();

      // this.zone.run(() => {
      //   event.target.complete();
      // });
      event.target.complete();
    }, 2000);
    // });
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
          const newContacts = [];
          if (filteredContacts.length > 0) {
            newContacts.push({ db: filteredContacts[0], oneOne, name });
          }
          this.contacts.push(...newContacts);
          this.contactSubject.next(this.contacts);
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

    function setLocalStorageItem(key: string, value: any) {
      localStorage.setItem(key, JSON.stringify(value));
      localStorage.setItem(`${key}_timestamp`, new Date().toISOString());
    }

    setLocalStorageItem('contacts', this.contacts);
    setLocalStorageItem('filtered', this.notRegistered);
  };

  ngOnDestroy() {
    // Unsubscribe from any subscriptions or clear any resources here
    this.contactSubject.unsubscribe();
    this.notRegistered = [];
    this.contacts = [];
  }
}

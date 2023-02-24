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
    private platform: Platform
  ) {
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

    if (filteredContacts && timestamp) {
      const lastUpdated: any = new Date(timestamp);
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
      this.contacts = [];
      this.notRegistered = [];

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
      name: true,
      phones: true,
      postalAddresses: true,
    };

    const result = await Contacts.getContacts({
      projection,
    });

    this.notRegistered = result.contacts;

    const newContacts = []; // create an array to hold the new contacts
    const notRegistered = []; // create an array to hold the not registered contacts

    for (const contact of result.contacts) {
      const { name, phones } = contact;

      if (phones && phones.length > 0) {
        for (const phone of phones) {
          let number = phone?.number?.replace(/\D/g, '');
          if (phone?.number?.startsWith('27')) {
            number = number?.slice(2);
          }
          if (phone?.number?.startsWith('0')) {
            number = number?.slice(1);
          }

          const filteredContacts = this.contactsDatabase.filter(
            (dbContact: any) => dbContact.cellphone.toString() === number
          );

          if (filteredContacts.length > 0) {
            newContacts.push({ db: filteredContacts[0], phone, name });
          } else {
            notRegistered.push({ contact, phone, name });
          }
        }
      }
    }

    this.contacts.push(...newContacts);
    this.contactSubject.next(this.contacts);

    this.notRegistered = notRegistered;

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
      // set the timestamp only once
      if (key === 'contacts') {
        localStorage.setItem(`${key}_timestamp`, new Date().toISOString());
      }
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

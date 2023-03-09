import { StorageService } from '../../services/storage.service';
import { Component, OnInit } from '@angular/core';
import { Contacts } from '@capacitor-community/contacts';
import { StatusBar } from '@capacitor/status-bar';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { Platform } from '@ionic/angular';
import { ContactPayload } from '../../model/notRegistered.model';
import { Contact } from '../../model/contacts.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  constructor(
    private user: UserService,
    private token: TokenService,
    private platform: Platform,
    private storage: StorageService,
    private chat: ChatService
  ) {
    this.contactSubject = new BehaviorSubject<any[]>([]);
    this.contacts$ = this.contactSubject.asObservable();
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
    chat.getStatus().subscribe((status: any) => {
      this.status = status.users;
    })
  }
  status: any = [];
  hold: any = this.token.decode();
  contactsDatabase: any = [];
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  isUserOnline(userID: string): boolean {
    return this.status?.indexOf(userID) !== -1;
  }

  ngOnInit() {
    this.getUsers();
    // this.getContactsFromCache();
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
        this.storage.setContacts(this.contacts);
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
          this.contactsDatabase = res;
        })
      )
      .subscribe(() => {
        this.retrieveListOfContacts();
        this.loading$.next(false);
      });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Any calls to load data go here
      this.contacts = [];
      this.notRegistered = [];

      this.getUsers();
      event.target.complete();
    }, 2000);
  }

  contacts$!: Observable<any[]>;
  private contactSubject!: BehaviorSubject<any[]>;

  contacts: any = [];
  notRegistered: ContactPayload[] = [];

  retrieveListOfContacts = async () => {
    const projection = {
      name: true,
      phones: true,
    };

    const result = await Contacts.getContacts({
      projection,
    });

    // this.notRegistered = result.contacts

    let newContacts = []; // create an array to hold the new contacts
    // let notRegistered: ContactPayload[] = [];

    const contactsMap: Record<string, Contact> = {};

    for (const contact of this.contactsDatabase) {
      if (contact.cellphone) {
        const phoneStr = contact.cellphone.replace(/\D/g, '').toString();
        contactsMap[phoneStr] = contact;
      }
    }

    for (const contact of result.contacts) {
      const { name, phones } = contact;
      if (phones && phones.length > 0) {
        for (const phone of phones) {
          let number = phone?.number?.replace(/\D/g, '');
          // if (phone?.number?.startsWith('27')) {
          //   number = number?.slice(2);
          // }
          // if (phone?.number?.startsWith('0')) {
          //   number = number?.slice(1);
          // }

          const dbContact = number !== undefined ? contactsMap[number] : undefined;
          if (dbContact) {
            newContacts.push({ db: dbContact, phone, name });
          } else {
            // notRegistered.push({ contact, phone, name });
          }
        }
      }
    }

    // Remove duplicates
    newContacts = newContacts.filter((contact, index, self) =>
      index === self.findIndex(c => (
        c.db['cellphone'] === contact.db['cellphone'] &&
        c?.name?.display === contact?.name?.display
      ))
    );

    this.contacts.push(...newContacts);
    this.contactSubject.next(this.contacts);

    // this.notRegistered = notRegistered;

    this.contacts.sort(
      (a: { name: { display: string } }, b: { name: { display: any } }) =>
        a.name.display.localeCompare(b.name.display)
    );

    // this.notRegistered.sort(
    //   (a: ContactPayload, b: ContactPayload) =>
    //     (a?.name?.display || '').localeCompare(b?.name?.display || '')
    // );

    function setLocalStorageItem(key: string, value: any) {
      localStorage.setItem(key, JSON.stringify(value));
      // set the timestamp only once
      if (key === 'contacts') {
        localStorage.setItem(`${key}_timestamp`, new Date().toISOString());
      }
    }

     // Remove current user from contacts
    let otherUserContacts: any;
     const currentUser = this.hold;
     if (currentUser && currentUser.cellphone) {
       const currentUserNumber = currentUser.cellphone.toString().replace(/\D/g, '');
       otherUserContacts = this.contacts.filter((contact:Contact) => {
         const contactNumber = contact?.db?.cellphone?.toString().replace(/\D/g, '');
         return contactNumber !== currentUserNumber;
       });
     }

    this.storage.setContacts(otherUserContacts);
    setLocalStorageItem('contacts', this.contacts);
    setLocalStorageItem('choose', otherUserContacts);
  };

  ngOnDestroy() {
    // Unsubscribe from any subscriptions or clear any resources here
    this.contactSubject.unsubscribe();
    this.notRegistered = [];
    this.contacts = [];
  }
}

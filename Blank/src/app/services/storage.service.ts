import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../model/contacts';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  constructor() {}

  set(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string) {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  remove(key: string) {
    window.localStorage.removeItem(key);
  }

  clear() {
    window.localStorage.clear();
  }

  contacts: Contact[] = [];

  setContacts(contacts: Contact[]){
    this.contacts = contacts;
  }

  getContacts(){
    return this.contacts;
  }


  private messageSource = new BehaviorSubject<any[]>([]);
  currentMessage = this.messageSource.asObservable();
  private otherUsers = new BehaviorSubject<any>({});
  user = this.otherUsers.asObservable();
  private userType = new BehaviorSubject<any>('');
  types = this.userType.asObservable();

  changeMessage(message: any[], otherUser: any, type: string): void {
    this.messageSource.next(message);
    this.otherUsers.next(otherUser);
    this.userType.next(type);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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

  private messageSource = new BehaviorSubject<any[]>([]);
  currentMessage = this.messageSource.asObservable();
  private otherUsers = new BehaviorSubject<any>({});
  user = this.otherUsers.asObservable();

  changeMessage(message: any[], otherUser: any): void {
    this.messageSource.next(message);
    this.otherUsers.next(otherUser);
  }
}

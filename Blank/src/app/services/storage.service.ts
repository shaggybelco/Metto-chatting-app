import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}
  
  private messageSource = new BehaviorSubject([]);
  currentMessage = this.messageSource.asObservable();
  private otherUsers = new BehaviorSubject({});
  user = this.otherUsers.asObservable();

  changeMessage(message: any, otherUser: any) {
    this.messageSource.next(message);
    this.otherUsers.next(otherUser);
  }
}

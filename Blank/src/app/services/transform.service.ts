import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransformService {
  constructor() { }

  transform(date: string) {
    // if (!date) {
    //   return 'long time ago';
    // }

    // let time = (Date.now() - Date.parse(date)) / 1000;

    // if (time < 5) {
    //   return 'just now';
    // } else if (time < 60) {
    //   return time + ' seconds';
    // } else if (time < 3600) {
    //   return Math.floor(time / 60) + ' minutes';
    // } else if (time < 86400) {
    //   const dateObject = new Date(Date.parse(date));
    //   return dateObject.getHours() + ':' + dateObject.getMinutes();
    // } else if (time < 126400) {
    //   return 'yesterday';
    // } else {
    //   const dateObject = new Date(Date.parse(date));
    //   return dateObject.toLocaleDateString('en-ZA', {
    //     day: 'numeric',
    //     month: 'short',
    //     year: 'numeric',
    //   });
    // }

    // else if (time < 3600) {
    //   return Math.floor(time / 60) + ':' + String(Math.floor(time % 60)).padStart(2, '0');
    // } else if (time < 86400) {
    //   const dateObject = new Date(Date.parse(date));
    //   return dateObject.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' });
    // } else if (time < 126400) {
    //   return 'yesterday';
    // }

    const now: any = new Date();
    const then: any = new Date(date);
    
    if (isNaN(then.getTime())) {
      return 'Long time ago';
    }
    
    const secondsAgo = Math.floor((now - then) / 1000);
    const hoursAgo = Math.floor(secondsAgo / 3600);
    
    if (secondsAgo < 10) {
      return 'just now';
    } else if (secondsAgo < 60) {
      return secondsAgo + ' seconds ago';
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return minutesAgo + ' minute' + (minutesAgo === 1 ? '' : 's') + ' ago';
    } else if (secondsAgo < 126400) {
        return 'yesterday';
    } else {
      return then.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    
  }
}

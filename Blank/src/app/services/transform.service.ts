import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TransformService {
  constructor() {}

  transform(date: string) {
    if (!date) {
      return 'long time ago';
    }

    let time = (Date.now() - Date.parse(date)) / 1000;

    if (time < 5) {
      return 'Just now';
    } else if (time < 60) {
      return 'Seconds ago';
    } else if (time < 3600) {
      return Math.floor(time / 60) + ' minutes';
    } else if (time < 86400) {
      const dateObject = new Date(Date.parse(date));
      const hours = dateObject.getHours().toString().padStart(2, '0');
      const minutes = dateObject.getMinutes().toString().padStart(2, '0');
      return hours + ':' + minutes;
    } else if (time < 126400) {
      return 'Yesterday';
    } else {
      const dateObject = new Date(Date.parse(date));
      return dateObject.toLocaleDateString('en-ZA', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { } 
  // isLoading: boolean = false;

  loading(load?: boolean):Boolean{
    console.log(load);
    return load!;
  }
}

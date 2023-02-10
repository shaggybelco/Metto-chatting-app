import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}

  header = new HttpHeaders;

  token: any;
  tokenDcd: any;

  
  decode(){
    this.token = localStorage.getItem('token');
    console.log(jwt_decode(`${this.token}`));

    return jwt_decode(this.token);
  }
}

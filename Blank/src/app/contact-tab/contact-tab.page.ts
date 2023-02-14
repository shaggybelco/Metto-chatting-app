import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@capacitor/status-bar';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-contact-tab',
  templateUrl: './contact-tab.page.html',
  styleUrls: ['./contact-tab.page.scss'],
})
export class ContactTabPage implements OnInit {

  constructor(private token: TokenService, private user: UserService) {StatusBar.setBackgroundColor({ color: '#3dc2ff' }); }

  hold: any;
  users: any;

  ngOnInit() {
    this.hold = this.token.decode();

    this.user.getUsers(this.hold.id).subscribe((res: any)=>{
      console.log(res);
      this.users = res;
    })
  }
}

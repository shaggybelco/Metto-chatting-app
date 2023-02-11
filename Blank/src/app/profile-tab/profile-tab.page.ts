import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-profile-tab',
  templateUrl: './profile-tab.page.html',
  styleUrls: ['./profile-tab.page.scss'],
})
export class ProfileTabPage implements OnInit {

  constructor(private token: TokenService) { }

  hold: any;
  ngOnInit() {
    this.hold = this.token.decode();
  }

}

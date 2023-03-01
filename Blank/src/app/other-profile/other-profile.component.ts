import { UserService } from '../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.scss'],
})
export class OtherProfileComponent implements OnInit {
  constructor(
    public prof: UserService,
    private route: ActivatedRoute
  ) {
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
  }
  me: any = {
    name: '',
    cellphone: '',
  };
  username: string = '';

  otherId = this.route.snapshot.params['otherId'];

  ngOnInit() {
    this.getMe();
    console.log(this.otherId);
  }

  getMe() {
    this.prof.getMe(this.otherId).subscribe({
      next: (res: any) => {
        console.log(res[0]);
        this.me = res[0];
        this.username = this.me.name;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}

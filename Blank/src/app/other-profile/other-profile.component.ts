import { UserService } from '../services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.scss'],
})
export class OtherProfileComponent implements OnInit {
  constructor(public prof: UserService, private route: ActivatedRoute, private token: TokenService, private router: Router) {
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
  }
  me: any = {
    name: '',
    cellphone: '',
  };
  username: string = '';

  otherId = this.route.snapshot.params['otherId'];
  type = this.route.snapshot.params['type'];
  member: any = [];
  created_by: string = '';
  hold: any = this.token.decode();

  ngOnInit() {
    this.getMe();
    console.log(this.otherId);
  }

  getMe() {
    // if (this.otherId === this.hold.id) { 
    //   this.router.navigate(['/tab/profile'])
    // }
    // else
      if (this.type === 'user') {
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
      } else if (this.type === 'group') {
        this.prof.getGroup(this.otherId).subscribe({
          next: (res: any) => {
            console.log(res);
            this.me = res.group;
            this.member = res.members;
            this.username = this.me.name;
            this.created_by = res.group.created_by._id
            console.log(this.created_by);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
      }
  }
}

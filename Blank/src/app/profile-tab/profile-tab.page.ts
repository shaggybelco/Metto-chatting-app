import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-profile-tab',
  templateUrl: './profile-tab.page.html',
  styleUrls: ['./profile-tab.page.scss'],
})
export class ProfileTabPage implements OnInit {
  constructor(
    public prof: UserService,
    private route: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private token: TokenService
  ) {
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
  }

  presentingElement = undefined;
  decode: any = this.token.decode();
  me: any;
  username: string = '';

  ngOnInit() {
    this.getMe();
  }

  getMe() {
    this.prof.getMe(this.decode.id).subscribe(
      (res: any) => {
        console.log(res[0]);
        this.me = res[0];
        this.username = this.me.name;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  file: any;
  input: any;
  isAvatar: boolean = false;
  dataUrl: any;

  async openFileBrowser() {
    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.click();

    this.input.onchange = (e: any) => {
      this.file = this.input.files[0];
      console.log(this.file);

      const reader = new FileReader();

      reader.onloadend = () => {
        this.dataUrl = reader.result;
      };

      reader.readAsDataURL(this.file);
    };
  }

  update() {
    const data = {
      id: this.decode.id,
      name: this.username,
      isAvatar: true,
    };

    console.log(data);
    this.prof.upload$.subscribe((res: any) => {
      console.log(res);
    });
    this.prof.uploadImage(this.file, data);
    this.getMe();
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
          icon: 'checkmark',
        },
        {
          text: 'No',
          role: 'destructive',
          icon: 'ban', 
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    if (role === 'confirm') {
      this.getMe();
    }

    return role === 'confirm';
  };
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { StatusBar } from '@capacitor/status-bar';
import { StorageService } from '../../services/storage.service';
import { Contact } from '../../model/contacts.model';
import { UploadService } from 'src/app/services/upload.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {
  constructor(
    private token: TokenService,
    private storage: StorageService,
    private upload: UploadService,
    private http: HttpClient,
    private chat: ChatService
  ) {
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
  }

  contactToChoseOn: Contact[] = [];
  selectedContacts: Contact[] = [];

  ngOnInit(): void {
    this.contactToChoseOn = this.storage.getContacts();
  }

  ngAfterViewChecked() {
    this.contactToChoseOn = this.storage.getContacts();
    const contacts = localStorage.getItem('choose');
    if (this.contactToChoseOn.length === 0) {
      this.contactToChoseOn = JSON.parse(contacts!);
    }
  }

  removeItem(item: Contact) {
    const index = this.selectedContacts.indexOf(item);
    if (index > -1) {
      this.selectedContacts.splice(index, 1);
    }
  }

  addItem(contact: Contact) {
    if (contact && this.selectedContacts.indexOf(contact) < 0) {
      this.selectedContacts.push(contact);
    } else {
      this.removeItem(contact);
    }
  }

  isSelected(item: Contact): boolean {
    return this.selectedContacts.includes(item);
  }

  hold: any = this.token.decode();

  @ViewChild(IonModal)
  modal!: IonModal;

  message =
    'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;
  desc!: string;

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  file: any;
  input: any;
  isAvatar: boolean = false;
  dataUrl: any;

  async openFileBrowser() {
    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.click();

    this.input.onchange = () => {
      this.file = this.input.files[0];

      const reader = new FileReader();

      reader.onloadend = () => {
        this.dataUrl = reader.result;
      };

      reader.readAsDataURL(this.file);
    };
  }

  async createGroup() {
    if (this.selectedContacts.length > 0) {

      if (this.file) {
        this.isAvatar = true;
      } else {
        this.isAvatar = false;
      }
      const CLOUDINARY_URL = `${environment.CLOUDINARY_URL}/${environment.cloud_name}/upload`;
      let imgUrl = '';

      const addMe: Contact = {
        db: {
          _id: this.hold.id
        },
        name: {
          display: this.hold.name,
          given: this.hold.name,
          middle: '',
          family: '',
          prefix: '',
          suffix: '',
        },
        phone: this.hold.cellphone
      }

      if (this.isAvatar) {
        const formData = new FormData();
        formData.append('file', this.dataUrl);
        formData.append('upload_preset', environment.cloud_preset);
        formData.append('api_key', environment.api_key);
        formData.append('api_secret', environment.api_secret);
        formData.append('folder', 'chatpp');
        this.http
          .post(CLOUDINARY_URL, formData, {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            },
          })
          .subscribe({
            next: (res: any) => {
              console.log(res);
              imgUrl = res.secure_url;

              const data = {
                name: this.name,
                description: this.desc,
                created_by: this.hold.id,
                isAvatar: this.isAvatar,
                avatar: imgUrl,
                users: this.selectedContacts.concat(addMe)
              };

              this.chat.createGroup(data).subscribe({
                next: (res: any) => {
                  console.log(res);
                }, error: (err: any) => {
                  console.log(err);
                }
              })
            },
            error: (err: any) => {
              console.log(err);
            },
          });
      } else {
        const data = {
          name: this.name,
          description: this.desc,
          created_by: this.hold.id,
          isAvatar: this.isAvatar,
          avatar: imgUrl,
          users: this.selectedContacts.concat(addMe)
        };

        this.chat.createGroup(data).subscribe({
          next: (res: any) => {
            console.log(res);
          }, error: (err: any) => {
            console.log(err);
          }
        })
      }

    } else {
      // toast
      this.chat.showError('You have not selected participants')
    }
  }
}

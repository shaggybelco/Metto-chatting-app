import { Component, OnInit, ViewChild } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { StatusBar } from '@capacitor/status-bar';
import { StorageService } from '../../services/storage.service';
import { Contact } from '../../model/contacts.model';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.page.html',
  styleUrls: ['./new-chat.page.scss'],
})
export class NewChatPage implements OnInit {
  constructor(
    private token: TokenService, private storage: StorageService) {
    StatusBar.setBackgroundColor({ color: '#3dc2ff' });
  }

  contactToChoseOn: Contact[] = [];
  selectedContacts: Contact[] = [];

  ngOnInit(): void {
    this.contactToChoseOn = this.storage.getContacts();
  }

  ngAfterViewChecked(){
    this.contactToChoseOn = this.storage.getContacts();
    const contacts = localStorage.getItem('choose');
    if(this.contactToChoseOn.length === 0){
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
    }else{
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
      console.log(this.file);

      const reader = new FileReader();

      reader.onloadend = () => {
        this.dataUrl = reader.result;
      };

      reader.readAsDataURL(this.file);
    };
  }
}

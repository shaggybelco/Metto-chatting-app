import {
  Component,
  Input,
  OnInit,
  ViewChild,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Country } from '../../model/Country.model';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from 'src/app/services/countries.service';

@Component({
  selector: 'app-phone-input',
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss'],
})
export class PhoneInputComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal!: IonModal;

  constructor(
    private auth: AuthService,
    private user: AuthService,
    private router: Router,
    private token: TokenService,
    private phone: PhoneNumberUtil,
    private countriesArray: CountriesService
  ) { 
    this.countries= this.countriesArray.countries;
  }

  countries: Country[] = [];  
  public load$: BehaviorSubject<any> = new BehaviorSubject(false);

  selectedFruitsText: string = '0 Items';
  selectedFruits: string[] = [];

  canDismiss = false;

  presentingElement: any;
  cellphone = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]);
  name = new FormControl('', [Validators.required, Validators.minLength(3)]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  ngOnInit() {
    this.selectedCountry = this.countries[0];
    this.mask = this.selectedCountry.mask;
    this.presentingElement = document.querySelector('.ion-page');
  }

  cellphoneChange(ev: any) {
    const number = this.phone.parseAndKeepRawInput(
      ev.target.value,
      this.selectedCountry.iso2
    );
  }

  signin() {
    const number = this.phone.parseAndKeepRawInput(
      this.cellphone.value!,
      this.selectedCountry.iso2
    );

    this.isCorrect = this.phone.isValidNumberForRegion(
      number,
      this.selectedCountry.iso2
    );
    if (this.isCorrect) {
      this.load$.next(true);
      this.auth
        .signin({
          cellphone: this.cellphone.value,
          password: this.password.value,
          country: this.selectedCountry.name,
        })
        .subscribe({
          next: (res: any) => {
            this.isUser = false;
            if (this.isUser === false) {
              localStorage.setItem('token', res.token);
              this.token.token = res.token;
              this.router.navigate(['/tab']);
              this.load$.next(false);
            }
          },
          error: (err: any) => {
            console.log(err);
            this.load$.next(false);
          },
          complete: () => {
            this.load$.next(false);
          },
        });
    }
  }

  isCorrect: boolean = false;

  onSubmit() {
    const number = this.phone.parseAndKeepRawInput(
      this.cellphone.value!,
      this.selectedCountry.iso2
    );

    this.isCorrect = this.phone.isValidNumberForRegion(
      number,
      this.selectedCountry.iso2
    );
    if (this.isCorrect) {
      this.load$.next(true);
      this.auth
        .checkUser({
          cellphone: this.cellphone.value,
          country: this.selectedCountry.name,
        })
        .subscribe({
          next: (res: any) => {
            if (!res) {
              this.setOpen(true);
              this.isUser = false;
              this.load$.next(false);
            } else {
              this.setIsUser(true);
              this.load$.next(false);
            }
          },

        });
    }
  }

  Register() {
    const number = this.phone.parseAndKeepRawInput(
      this.cellphone.value!,
      this.selectedCountry.iso2
    );

    this.isCorrect = this.phone.isValidNumberForRegion(
      number,
      this.selectedCountry.iso2
    );
    if (this.isCorrect) {
      this.load$.next(true);
      this.auth
        .signup({
          name: this.name.value,
          cellphone: this.cellphone.value,
          password: this.password.value,
          country: this.selectedCountry.name,
        })
        .subscribe({
          next: (res: any) => {
            localStorage.setItem('token', res.token);
            this.token.token = res.token;
            this.router.navigate(['/tab']);
          },
          error: (err: any) => {
            console.log(err);
            this.setOpen(false);
            this.load$.next(false);
          }
        });
    }
  }

  isUser = false;
  isModalOpen = false;

  setIsUser(isUser: boolean) {
    this.isUser = isUser;
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  countrySelection(country: Country) {
    this.selectedCountry = country;

    this.modal.dismiss();
  }

  selectedCity1: any;

  selectedCity2: any;

  selectedCountry!: Country;

  mask!: string;

  onCountryChange() {
    this.mask = this.selectedCountry.mask;
    this.cellphone.setValue('');
  }

  onPhoneNumberInput() {
    this.cellphone.setValue(this.cellphone.value);
  }

  getMaskLength(): number {
    return this.selectedCountry.mask.replace(/\D/g, '').length;
  }

}

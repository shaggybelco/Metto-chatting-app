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
import { Country } from '../model/Country.model';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { PhoneNumberUtil } from 'google-libphonenumber';

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
    private phone: PhoneNumberUtil
  ) {}

  selectedFruitsText: string = '0 Items';
  selectedFruits: string[] = [];

  @Output() changePhone = new EventEmitter<void>();
  cellphone: string = '';
  password: string = '';
  name: string = '';

  canDismiss = false;

  presentingElement: any;

  ngOnInit() {
    this.selectedCountry = this.countries[0];
    this.mask = this.selectedCountry.mask;
    this.presentingElement = document.querySelector('.ion-page');
  }

  cellphoneChange(ev: any) {
    console.log(ev.target.value);
    const number = this.phone.parseAndKeepRawInput(
      ev.target.value,
      this.selectedCountry.iso2
    );
    console.log(
      this.phone.isValidNumberForRegion(number, this.selectedCountry.iso2)
    );
  }

  signin() {
    const number = this.phone.parseAndKeepRawInput(
      this.cellphone,
      this.selectedCountry.iso2
    );
    console.log(
      this.phone.isValidNumberForRegion(number, this.selectedCountry.iso2)
    );

    this.isCorrect = this.phone.isValidNumberForRegion(
      number,
      this.selectedCountry.iso2
    );
    if (this.isCorrect) {
      this.auth
        .signin({
          cellphone: this.cellphone.replace(/\D/g, ''),
          password: this.password,
        })
        .subscribe({
          next: (res: any) => {
            this.isUser = false;
            if (this.isUser === false) {
              console.log(res);
              localStorage.setItem('token', res.token);
              this.token.token = res.token;
              this.router.navigate(['/tab']);
            }
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    }
  }

  isCorrect: boolean = false;

  onSubmit() {
    console.log(this.cellphone.replace(/\D/g, ''));
    const number = this.phone.parseAndKeepRawInput(
      this.cellphone,
      this.selectedCountry.iso2
    );
    console.log(
      this.phone.isValidNumberForRegion(number, this.selectedCountry.iso2)
    );

    this.isCorrect = this.phone.isValidNumberForRegion(
      number,
      this.selectedCountry.iso2
    );
    if (this.isCorrect) {
      this.auth
        .login({ cellphone: this.cellphone.replace(/\D/g, '') })
        .subscribe({
          next: (res: any) => {
            if (!res) {
              this.setOpen(true);
              this.isUser = false;
            } else {
              console.log(res);
              this.setIsUser(true);
            }
          },
        });
    }
  }

  Register() {
    console.log(this.cellphone);
    const number = this.phone.parseAndKeepRawInput(
      this.cellphone,
      this.selectedCountry.iso2
    );
    console.log(
      this.phone.isValidNumberForRegion(number, this.selectedCountry.iso2)
    );

    this.isCorrect = this.phone.isValidNumberForRegion(
      number,
      this.selectedCountry.iso2
    );
    if (this.isCorrect) {
      this.auth
        .signup({
          name: this.name,
          cellphone: this.cellphone.replace(/\D/g, ''),
          password: this.password,
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            localStorage.setItem('token', res.token);
            this.token.token = res.token;
            this.router.navigate(['/tab']);
          },
          error: (err: any) => {
            console.log(err);
            this.setOpen(false);
          },
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

    console.log(this.selectedCountry);
    this.modal.dismiss();
  }

  selectedCity1: any;

  selectedCity2: any;

  selectedCountry!: Country;

  mask!: string;

  onCountryChange() {
    this.mask = this.selectedCountry.mask;
    this.cellphone = '';
  }

  onPhoneNumberInput() {
    this.cellphone = this.cellphone.replace(/\D/g, '');
  }

  getMaskLength(): number {
    return this.selectedCountry.mask.replace(/\D/g, '').length;
  }

  onPhoneNumberEnter(number: any) {
    console.log();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  countries: Country[] = [
    {
      name: 'Afghanistan',
      iso2: 'AF',
      iso3: 'AFG',
      code: '+93',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/af.png',
    },
    {
      name: 'Albania',
      iso2: 'AL',
      iso3: 'ALB',
      code: '+355',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/al.png',
    },
    {
      name: 'Algeria',
      iso2: 'DZ',
      iso3: 'DZA',
      code: '+213',
      mask: '9999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/dz.png',
    },
    {
      name: 'Andorra',
      iso2: 'AD',
      iso3: 'AND',
      code: '+376',
      mask: '999 999',
      flag: 'https://flagpedia.net/data/flags/h80/ad.png',
    },
    {
      name: 'Angola',
      iso2: 'AO',
      iso3: 'AGO',
      code: '+244',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/ao.png',
    },
    {
      name: 'Antigua and Barbuda',
      iso2: 'AG',
      iso3: 'ATG',
      code: '+1 268',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/ag.png',
    },
    {
      name: 'Argentina',
      iso2: 'AR',
      iso3: 'ARG',
      code: '+54',
      mask: '9 9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ar.png',
    },
    {
      name: 'Armenia',
      iso2: 'AM',
      iso3: 'ARM',
      code: '+374',
      mask: '99 999999',
      flag: 'https://flagpedia.net/data/flags/h80/am.png',
    },
    {
      name: 'Australia',
      iso2: 'AU',
      iso3: 'AUS',
      code: '+61',
      mask: '9999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/au.png',
    },
    {
      name: 'Austria',
      iso2: 'AT',
      iso3: 'AUT',
      code: '+43',
      mask: '9999 999999',
      flag: 'https://flagpedia.net/data/flags/h80/at.png',
    },
    {
      name: 'Azerbaijan',
      iso2: 'AZ',
      iso3: 'AZE',
      code: '+994',
      mask: '99 999 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/az.png',
    },
    {
      name: 'Bahamas',
      iso2: 'BS',
      iso3: 'BHS',
      code: '+1 242',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/bs.png',
    },
    {
      name: 'Bahrain',
      iso2: 'BH',
      iso3: 'BHR',
      code: '+973',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/bh.png',
    },
    {
      name: 'Bangladesh',
      iso2: 'BD',
      iso3: 'BGD',
      code: '+880',
      mask: '99999-999999',
      flag: 'https://flagpedia.net/data/flags/h80/bd.png',
    },
    {
      name: 'Barbados',
      iso2: 'BB',
      iso3: 'BRB',
      code: '+1 246',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/bb.png',
    },
    {
      name: 'Belarus',
      iso2: 'BY',
      iso3: 'BLR',
      code: '+375',
      mask: '9 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/by.png',
    },
    {
      name: 'Belgium',
      iso2: 'BE',
      iso3: 'BEL',
      code: '+32',
      mask: '9999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/be.png',
    },
    {
      name: 'Belize',
      iso2: 'BZ',
      iso3: 'BLZ',
      code: '+501',
      mask: '999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/bz.png',
    },
    {
      name: 'Benin',
      iso2: 'BJ',
      iso3: 'BEN',
      code: '+229',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/bj.png',
    },
    {
      name: 'Bermuda',
      iso2: 'BM',
      iso3: 'BMU',
      code: '+1 441',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/bm.png',
    },
    {
      name: 'Bhutan',
      iso2: 'BT',
      iso3: 'BTN',
      code: '+975',
      mask: '17 17 17 17',
      flag: 'https://flagpedia.net/data/flags/h80/bt.png',
    },
    {
      name: 'Bolivia',
      iso2: 'BO',
      iso3: 'BOL',
      code: '+591',
      mask: '99999999',
      flag: 'https://flagpedia.net/data/flags/h80/bo.png',
    },
    {
      name: 'Bosnia and Herzegovina',
      iso2: 'BA',
      iso3: 'BIH',
      code: '+387',
      mask: '99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/ba.png',
    },
    {
      name: 'Botswana',
      iso2: 'BW',
      iso3: 'BWA',
      code: '+267',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/bw.png',
    },
    {
      name: 'Bulgaria',
      iso2: 'BG',
      iso3: 'BGR',
      code: '+359',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/bg.png',
    },
    {
      name: 'Burkina Faso',
      iso2: 'BF',
      iso3: 'BFA',
      code: '+226',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/bf.png',
    },
    {
      name: 'Burundi',
      iso2: 'BI',
      iso3: 'BDI',
      code: '+257',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/bi.png',
    },
    {
      name: 'Cambodia',
      iso2: 'KH',
      iso3: 'KHM',
      code: '+855',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/kh.png',
    },
    {
      name: 'Cameroon',
      iso2: 'CM',
      iso3: 'CMR',
      code: '+237',
      mask: '6 99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/cm.png',
    },
    {
      name: 'Canada',
      iso2: 'CA',
      iso3: 'CAN',
      code: '+1',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/ca.png',
    },
    {
      name: 'Cape Verde',
      iso2: 'CV',
      iso3: 'CPV',
      code: '+238',
      mask: '999 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/cv.png',
    },
    {
      name: 'Central African Republic',
      iso2: 'CF',
      iso3: 'CAF',
      code: '+236',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/cf.png',
    },
    {
      name: 'Chad',
      iso2: 'TD',
      iso3: 'TCD',
      code: '+235',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/td.png',
    },
    {
      name: 'Chile',
      iso2: 'CL',
      iso3: 'CHL',
      code: '+56',
      mask: '9 9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/cl.png',
    },
    {
      name: 'China',
      iso2: 'CN',
      iso3: 'CHN',
      code: '+86',
      mask: '999 9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/cn.png',
    },
    {
      name: 'Colombia',
      iso2: 'CO',
      iso3: 'COL',
      code: '+57',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/co.png',
    },
    {
      name: 'Comoros',
      iso2: 'KM',
      iso3: 'COM',
      code: '+269',
      mask: '99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/km.png',
    },
    {
      name: 'Congo (Brazzaville)',
      iso2: 'CG',
      iso3: 'COG',
      code: '+242',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/cg.png',
    },
    {
      name: 'Congo (Kinshasa)',
      iso2: 'CD',
      iso3: 'COD',
      code: '+243',
      mask: '99 99 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/cd.png',
    },
    {
      name: 'Denmark',
      iso2: 'DK',
      iso3: 'DNK',
      code: '+45',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/dk.png',
    },
    {
      name: 'Djibouti',
      iso2: 'DJ',
      iso3: 'DJI',
      code: '+253',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/dj.png',
    },
    {
      name: 'Dominica',
      iso2: 'DM',
      iso3: 'DMA',
      code: '+1 767',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/dm.png',
    },
    {
      name: 'Dominican Republic',
      iso2: 'DO',
      iso3: 'DOM',
      code: '+1 809',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/do.png',
    },
    {
      name: 'East Timor',
      iso2: 'TL',
      iso3: 'TLS',
      code: '+670',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/tl.png',
    },
    {
      name: 'Ecuador',
      iso2: 'EC',
      iso3: 'ECU',
      code: '+593',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/ec.png',
    },
    {
      name: 'Egypt',
      iso2: 'EG',
      iso3: 'EGY',
      code: '+20',
      mask: '99 99999999',
      flag: 'https://flagpedia.net/data/flags/h80/eg.png',
    },
    {
      name: 'El Salvador',
      iso2: 'SV',
      iso3: 'SLV',
      code: '+503',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/sv.png',
    },
    {
      name: 'Equatorial Guinea',
      iso2: 'GQ',
      iso3: 'GNQ',
      code: '+240',
      mask: '99 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/gq.png',
    },
    {
      name: 'Eritrea',
      iso2: 'ER',
      iso3: 'ERI',
      code: '+291',
      mask: '99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/er.png',
    },
    {
      name: 'Estonia',
      iso2: 'EE',
      iso3: 'EST',
      code: '+372',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ee.png',
    },
    {
      name: 'Eswatini',
      iso2: 'SZ',
      iso3: 'SWZ',
      code: '+268',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/sz.png',
    },
    {
      name: 'Ethiopia',
      iso2: 'ET',
      iso3: 'ETH',
      code: '+251',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/et.png',
    },
    {
      name: 'Fiji',
      iso2: 'FJ',
      iso3: 'FJI',
      code: '+679',
      mask: '999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/fj.png',
    },
    {
      name: 'Finland',
      iso2: 'FI',
      iso3: 'FIN',
      code: '+358',
      mask: '999 9999999',
      flag: 'https://flagpedia.net/data/flags/h80/fi.png',
    },
    {
      name: 'France',
      iso2: 'FR',
      iso3: 'FRA',
      code: '+33',
      mask: '99 99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/fr.png',
    },
    {
      name: 'French Guiana',
      iso2: 'GF',
      iso3: 'GUF',
      code: '+594',
      mask: '9999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/gf.png',
    },
    {
      name: 'French Polynesia',
      iso2: 'PF',
      iso3: 'PYF',
      code: '+689',
      mask: '99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/pf.png',
    },
    {
      name: 'French Southern Territories',
      iso2: 'TF',
      iso3: 'ATF',
      code: '+262',
      mask: '999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/tf.png',
    },
    {
      name: 'Gabon',
      iso2: 'GA',
      iso3: 'GAB',
      code: '+241',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/ga.png',
    },
    {
      name: 'Gambia',
      iso2: 'GM',
      iso3: 'GMB',
      code: '+220',
      mask: '999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/gm.png',
    },
    {
      name: 'Georgia',
      iso2: 'GE',
      iso3: 'GEO',
      code: '+995',
      mask: '9 99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/ge.png',
    },
    {
      name: 'Germany',
      iso2: 'DE',
      iso3: 'DEU',
      code: '+49',
      mask: '9999 999999',
      flag: 'https://flagpedia.net/data/flags/h80/de.png',
    },
    {
      name: 'Ghana',
      iso2: 'GH',
      iso3: 'GHA',
      code: '+233',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/gh.png',
    },
    {
      name: 'Gibraltar',
      iso2: 'GI',
      iso3: 'GIB',
      code: '+350',
      mask: '999 99999',
      flag: 'https://flagpedia.net/data/flags/h80/gi.png',
    },
    {
      name: 'Greece',
      iso2: 'GR',
      iso3: 'GRC',
      code: '+30',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/gr.png',
    },
    {
      name: 'Greenland',
      iso2: 'GL',
      iso3: 'GRL',
      code: '+299',
      mask: '99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/gl.png',
    },
    {
      name: 'Grenada',
      iso2: 'GD',
      iso3: 'GRD',
      code: '+1',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/gd.png',
    },
    {
      name: 'Guadeloupe',
      iso2: 'GP',
      iso3: 'GLP',
      code: '+590',
      mask: '9999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/gp.png',
    },
    {
      name: 'Guam',
      iso2: 'GU',
      iso3: 'GUM',
      code: '+1',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/gu.png',
    },
    {
      name: 'Guatemala',
      iso2: 'GT',
      iso3: 'GTM',
      code: '+502',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/gt.png',
    },
    {
      name: 'Guinea',
      iso2: 'GN',
      iso3: 'GIN',
      code: '+224',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/gn.png',
    },
    {
      name: 'Guinea-Bissau',
      iso2: 'GW',
      iso3: 'GNB',
      code: '+245',
      mask: '99 99 99 999',
      flag: 'https://flagpedia.net/data/flags/h80/gw.png',
    },
    {
      name: 'Guyana',
      iso2: 'GY',
      iso3: 'GUY',
      code: '+592',
      mask: '999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/gy.png',
    },
    {
      name: 'Haiti',
      iso2: 'HT',
      iso3: 'HTI',
      code: '+509',
      mask: '99 99 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ht.png',
    },
    {
      name: 'Honduras',
      iso2: 'HN',
      iso3: 'HND',
      code: '+504',
      mask: '9999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/hn.png',
    },
    {
      name: 'Hong Kong',
      iso2: 'HK',
      iso3: 'HKG',
      code: '+852',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/hk.png',
    },
    {
      name: 'Hungary',
      iso2: 'HU',
      iso3: 'HUN',
      code: '+36',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/hu.png',
    },
    {
      name: 'Iceland',
      iso2: 'IS',
      iso3: 'ISL',
      code: '+354',
      mask: '999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/is.png',
    },
    {
      name: 'India',
      iso2: 'IN',
      iso3: 'IND',
      code: '+91',
      mask: '99999 99999',
      flag: 'https://flagpedia.net/data/flags/h80/in.png',
    },
    {
      name: 'Indonesia',
      iso2: 'ID',
      iso3: 'IDN',
      code: '+62',
      mask: '999-999-999',
      flag: 'https://flagpedia.net/data/flags/h80/id.png',
    },
    {
      name: 'Iran (Islamic Republic of)',
      iso2: 'IR',
      iso3: 'IRN',
      code: '+98',
      mask: '9999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ir.png',
    },
    {
      name: 'Iraq',
      iso2: 'IQ',
      iso3: 'IRQ',
      code: '+964',
      mask: '9999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/iq.png',
    },
    {
      name: 'Ireland',
      iso2: 'IE',
      iso3: 'IRL',
      code: '+353',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ie.png',
    },
    {
      name: 'Isle of Man',
      iso2: 'IM',
      iso3: 'IMN',
      code: '+44',
      mask: '99999 999999',
      flag: 'https://flagpedia.net/data/flags/h80/im.png',
    },
    {
      name: 'Israel',
      iso2: 'IL',
      iso3: 'ISR',
      code: '+972',
      mask: '999-999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/il.png',
    },
    {
      name: 'Italy',
      iso2: 'IT',
      iso3: 'ITA',
      code: '+39',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/it.png',
    },
    {
      name: 'Kazakhstan',
      iso2: 'KZ',
      iso3: 'KAZ',
      code: '+7',
      mask: '(999) 999-99-99',
      flag: 'https://flagpedia.net/data/flags/h80/kz.png',
    },
    {
      name: 'Kenya',
      iso2: 'KE',
      iso3: 'KEN',
      code: '+254',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ke.png',
    },
    {
      name: 'Kiribati',
      iso2: 'KI',
      iso3: 'KIR',
      code: '+686',
      mask: '999999',
      flag: 'https://flagpedia.net/data/flags/h80/ki.png',
    },
    {
      name: 'Korea (North)',
      iso2: 'KP',
      iso3: 'PRK',
      code: '+850',
      mask: '999 9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/kp.png',
    },
    {
      name: 'Korea (South)',
      iso2: 'KR',
      iso3: 'KOR',
      code: '+82',
      mask: '999-9999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/kr.png',
    },
    {
      name: 'Kuwait',
      iso2: 'KW',
      iso3: 'KWT',
      code: '+965',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/kw.png',
    },
    {
      name: 'Kyrgyzstan',
      iso2: 'KG',
      iso3: 'KGZ',
      code: '+996',
      mask: '9999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/kg.png',
    },
    {
      name: 'Laos',
      iso2: 'LA',
      iso3: 'LAO',
      code: '+856',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/la.png',
    },
    {
      name: 'Latvia',
      iso2: 'LV',
      iso3: 'LVA',
      code: '+371',
      mask: '99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/lv.png',
    },
    {
      name: 'Lebanon',
      iso2: 'LB',
      iso3: 'LBN',
      code: '+961',
      mask: '99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/lb.png',
    },
    {
      name: 'Lesotho',
      iso2: 'LS',
      iso3: 'LSO',
      code: '+266',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ls.png',
    },
    {
      name: 'Liberia',
      iso2: 'LR',
      iso3: 'LBR',
      code: '+231',
      mask: '99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/lr.png',
    },
    {
      name: 'Libya',
      iso2: 'LY',
      iso3: 'LBY',
      code: '+218',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/ly.png',
    },
    {
      name: 'Liechtenstein',
      iso2: 'LI',
      iso3: 'LIE',
      code: '+423',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/li.png',
    },
    {
      name: 'Lithuania',
      iso2: 'LT',
      iso3: 'LTU',
      code: '+370',
      mask: '(9-9) 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/lt.png',
    },
    {
      name: 'Luxembourg',
      iso2: 'LU',
      iso3: 'LUX',
      code: '+352',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/lu.png',
    },
    {
      name: 'Malawi',
      iso2: 'MW',
      iso3: 'MWI',
      code: '+265',
      mask: '9999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/mw.png',
    },
    {
      name: 'Malaysia',
      iso2: 'MY',
      iso3: 'MYS',
      code: '+60',
      mask: '999-999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/my.png',
    },
    {
      name: 'Maldives',
      iso2: 'MV',
      iso3: 'MDV',
      code: '+960',
      mask: '999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/mv.png',
    },
    {
      name: 'Mali',
      iso2: 'ML',
      iso3: 'MLI',
      code: '+223',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/ml.png',
    },
    {
      name: 'Malta',
      iso2: 'MT',
      iso3: 'MLT',
      code: '+356',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/mt.png',
    },
    {
      name: 'Marshall Islands',
      iso2: 'MH',
      iso3: 'MHL',
      code: '+692',
      mask: '999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/mh.png',
    },
    {
      name: 'Martinique',
      iso2: 'MQ',
      iso3: 'MTQ',
      code: '+596',
      mask: '9999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/mq.png',
    },
    {
      name: 'Mauritania',
      iso2: 'MR',
      iso3: 'MRT',
      code: '+222',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/mr.png',
    },
    {
      name: 'Mauritius',
      iso2: 'MU',
      iso3: 'MUS',
      code: '+230',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/mu.png',
    },
    {
      name: 'Mayotte',
      iso2: 'YT',
      iso3: 'MYT',
      code: '+262',
      mask: '9999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/yt.png',
    },
    {
      name: 'Mexico',
      iso2: 'MX',
      iso3: 'MEX',
      code: '+52',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/mx.png',
    },
    {
      name: 'Micronesia, Federated States of Micronesia',
      iso2: 'FM',
      iso3: 'FSM',
      code: '+691',
      mask: '999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/fm.png',
    },
    {
      name: 'Moldova',
      iso2: 'MD',
      iso3: 'MDA',
      code: '+373',
      mask: '9999 99 999',
      flag: 'https://flagpedia.net/data/flags/h80/md.png',
    },
    {
      name: 'Monaco',
      iso2: 'MC',
      iso3: 'MCO',
      code: '+377',
      mask: '99 99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/mc.png',
    },
    {
      name: 'Mongolia',
      iso2: 'MN',
      iso3: 'MNG',
      code: '+976',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/mn.png',
    },
    {
      name: 'Montenegro',
      iso2: 'ME',
      iso3: 'MNE',
      code: '+382',
      mask: '99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/me.png',
    },
    {
      name: 'Montserrat',
      iso2: 'MS',
      iso3: 'MSR',
      code: '+1664',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/ms.png',
    },
    {
      name: 'Morocco',
      iso2: 'MA',
      iso3: 'MAR',
      code: '+212',
      mask: '9999-9999-99',
      flag: 'https://flagpedia.net/data/flags/h80/ma.png',
    },
    {
      name: 'Mozambique',
      iso2: 'MZ',
      iso3: 'MOZ',
      code: '+258',
      mask: '99 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/mz.png',
    },
    {
      name: 'Namibia',
      iso2: 'NA',
      iso3: 'NAM',
      code: '+264',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/na.png',
    },
    {
      name: 'Nauru',
      iso2: 'NR',
      iso3: 'NRU',
      code: '+674',
      mask: '999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/nr.png',
    },
    {
      name: 'Nepal',
      iso2: 'NP',
      iso3: 'NPL',
      code: '+977',
      mask: '999-9999999',
      flag: 'https://flagpedia.net/data/flags/h80/np.png',
    },
    {
      name: 'Netherlands',
      iso2: 'NL',
      iso3: 'NLD',
      code: '+31',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/nl.png',
    },
    {
      name: 'New Caledonia',
      iso2: 'NC',
      iso3: 'NCL',
      code: '+687',
      mask: '99.99.99',
      flag: 'https://flagpedia.net/data/flags/h80/nc.png',
    },
    {
      name: 'New Zealand',
      iso2: 'NZ',
      iso3: 'NZL',
      code: '+64',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/nz.png',
    },
    {
      name: 'Nicaragua',
      iso2: 'NI',
      iso3: 'NIC',
      code: '+505',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ni.png',
    },
    {
      name: 'Niger',
      iso2: 'NE',
      iso3: 'NER',
      code: '+227',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/ne.png',
    },
    {
      name: 'Nigeria',
      iso2: 'NG',
      iso3: 'NGA',
      code: '+234',
      mask: '9999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ng.png',
    },
    {
      name: 'Niue',
      iso2: 'NU',
      iso3: 'NIU',
      code: '+683',
      mask: '999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/nu.png',
    },
    {
      name: 'Norfolk Island',
      iso2: 'NF',
      iso3: 'NFK',
      code: '+672',
      mask: '9 99999',
      flag: 'https://flagpedia.net/data/flags/h80/nf.png',
    },
    {
      name: 'Northern Mariana Islands',
      iso2: 'MP',
      iso3: 'MNP',
      code: '+1',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/mp.png',
    },
    {
      name: 'Norway',
      iso2: 'NO',
      iso3: 'NOR',
      code: '+47',
      mask: '999 99 999',
      flag: 'https://flagpedia.net/data/flags/h80/no.png',
    },
    {
      name: 'Oman',
      iso2: 'OM',
      iso3: 'OMN',
      code: '+968',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/om.png',
    },
    {
      name: 'Pakistan',
      iso2: 'PK',
      iso3: 'PAK',
      code: '+92',
      mask: '9999 9999999',
      flag: 'https://flagpedia.net/data/flags/h80/pk.png',
    },
    {
      name: 'Palau',
      iso2: 'PW',
      iso3: 'PLW',
      code: '+680',
      mask: '999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/pw.png',
    },
    {
      name: 'Palestine',
      iso2: 'PS',
      iso3: 'PSE',
      code: '+970',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ps.png',
    },
    {
      name: 'Panama',
      iso2: 'PA',
      iso3: 'PAN',
      code: '+507',
      mask: '9999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/pa.png',
    },
    {
      name: 'Papua New Guinea',
      iso2: 'PG',
      iso3: 'PNG',
      code: '+675',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/pg.png',
    },
    {
      name: 'Paraguay',
      iso2: 'PY',
      iso3: 'PRY',
      code: '+595',
      mask: '999999999',
      flag: 'https://flagpedia.net/data/flags/h80/py.png',
    },
    {
      name: 'Peru',
      iso2: 'PE',
      iso3: 'PER',
      code: '+51',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/pe.png',
    },
    {
      name: 'Philippines',
      iso2: 'PH',
      iso3: 'PHL',
      code: '+63',
      mask: '9999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ph.png',
    },
    {
      name: 'Poland',
      iso2: 'PL',
      iso3: 'POL',
      code: '+48',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/pl.png',
    },
    {
      name: 'Portugal',
      iso2: 'PT',
      iso3: 'PRT',
      code: '+351',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/pt.png',
    },
    {
      name: 'Puerto Rico',
      iso2: 'PR',
      iso3: 'PRI',
      code: '+1 787',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/pr.png',
    },
    {
      name: 'Qatar',
      iso2: 'QA',
      iso3: 'QAT',
      code: '+974',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/qa.png',
    },
    {
      name: 'Réunion',
      iso2: 'RE',
      iso3: 'REU',
      code: '+262',
      mask: '999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/re.png',
    },
    {
      name: 'Romania',
      iso2: 'RO',
      iso3: 'ROU',
      code: '+40',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/ro.png',
    },
    {
      name: 'Russia',
      iso2: 'RU',
      iso3: 'RUS',
      code: '+7',
      mask: '9 999 999 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/ru.png',
    },
    {
      name: 'Rwanda',
      iso2: 'RW',
      iso3: 'RWA',
      code: '+250',
      mask: '9999',
      flag: 'https://flagpedia.net/data/flags/h80/rw.png',
    },
    {
      name: 'Saint Barthélemy',
      iso2: 'BL',
      iso3: 'BLM',
      code: '+590',
      mask: '999 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/bl.png',
    },
    {
      name: 'Saint Helena, Ascension and Tristan da Cunha',
      iso2: 'SH',
      iso3: 'SHN',
      code: '+290',
      mask: '999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/sh.png',
    },
    {
      name: 'Saint Kitts and Nevis',
      iso2: 'KN',
      iso3: 'KNA',
      code: '+1 869',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/kn.png',
    },
    {
      name: 'Saint Lucia',
      iso2: 'LC',
      iso3: 'LCA',
      code: '+1 758',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/lc.png',
    },
    {
      name: 'Saint Martin (French part)',
      iso2: 'MF',
      iso3: 'MAF',
      code: '+590',
      mask: '999 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/mf.png',
    },
    {
      name: 'Saint Pierre and Miquelon',
      iso2: 'PM',
      iso3: 'SPM',
      code: '+508',
      mask: '99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/pm.png',
    },
    {
      name: 'Saint Vincent and the Grenadines',
      iso2: 'VC',
      iso3: 'VCT',
      code: '+1 784',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/vc.png',
    },
    {
      name: 'Samoa',
      iso2: 'WS',
      iso3: 'WSM',
      code: '+685',
      mask: '99 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ws.png',
    },
    {
      name: 'San Marino',
      iso2: 'SM',
      iso3: 'SMR',
      code: '+378',
      mask: '999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/sm.png',
    },
    {
      name: 'Sao Tome and Principe',
      iso2: 'ST',
      iso3: 'STP',
      code: '+239',
      mask: '99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/st.png',
    },
    {
      name: 'Saudi Arabia',
      iso2: 'SA',
      iso3: 'SAU',
      code: '+966',
      mask: '9 9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/sa.png',
    },
    {
      name: 'Senegal',
      iso2: 'SN',
      iso3: 'SEN',
      code: '+221',
      mask: '99 999 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/sn.png',
    },
    {
      name: 'Serbia',
      iso2: 'RS',
      iso3: 'SRB',
      code: '+381',
      mask: '999 9999999',
      flag: 'https://flagpedia.net/data/flags/h80/rs.png',
    },
    {
      name: 'Seychelles',
      iso2: 'SC',
      iso3: 'SYC',
      code: '+248',
      mask: '9 9 9 9 9 9',
      flag: 'https://flagpedia.net/data/flags/h80/sc.png',
    },
    {
      name: 'Sierra Leone',
      iso2: 'SL',
      iso3: 'SLE',
      code: '+232',
      mask: '(99) 999999',
      flag: 'https://flagpedia.net/data/flags/h80/sl.png',
    },
    {
      name: 'Singapore',
      iso2: 'SG',
      iso3: 'SGP',
      code: '+65',
      mask: '9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/sg.png',
    },
    {
      name: 'Sint Maarten (Dutch part)',
      iso2: 'SX',
      iso3: 'SXM',
      code: '+1 721',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/sx.png',
    },
    {
      name: 'Slovakia',
      iso2: 'SK',
      iso3: 'SVK',
      code: '+421',
      mask: '9999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/sk.png',
    },
    {
      name: 'Slovenia',
      iso2: 'SI',
      iso3: 'SVN',
      code: '+386',
      mask: '9 99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/si.png',
    },
    {
      name: 'Solomon Islands',
      iso2: 'SB',
      iso3: 'SLB',
      code: '+677',
      mask: '999 999',
      flag: 'https://flagpedia.net/data/flas/h80/sb.png',
    },
    {
      name: 'Somalia',
      iso2: 'SO',
      iso3: 'SOM',
      code: '+252',
      mask: '9 99 999999',
      flag: 'https://flagpedia.net/data/flags/h80/so.png',
    },
    {
      name: 'South Africa',
      iso2: 'ZA',
      iso3: 'ZAF',
      code: '+27',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/za.png',
    },
    {
      name: 'South Sudan',
      iso2: 'SS',
      iso3: 'SSD',
      code: '+211',
      mask: '99 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ss.png',
    },
    {
      name: 'Spain',
      iso2: 'ES',
      iso3: 'ESP',
      code: '+34',
      mask: '999 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/es.png',
    },
    {
      name: 'Sri Lanka',
      iso2: 'LK',
      iso3: 'LKA',
      code: '+94',
      mask: '99 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/lk.png',
    },
    {
      name: 'Sudan',
      iso2: 'SD',
      iso3: 'SDN',
      code: '+249',
      mask: '999 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/sd.png',
    },
    {
      name: 'Suriname',
      iso2: 'SR',
      iso3: 'SUR',
      code: '+597',
      mask: '999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/sr.png',
    },
    {
      name: 'Sweden',
      iso2: 'SE',
      iso3: 'SWE',
      code: '+46',
      mask: '999-999 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/se.png',
    },
    {
      name: 'Switzerland',
      iso2: 'CH',
      iso3: 'CHE',
      code: '+41',
      mask: '979 999 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/ch.png',
    },
    {
      name: 'Syrian Arab Republic',
      iso2: 'SY',
      iso3: 'SYR',
      code: '+963',
      mask: '9999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/sy.png',
    },
    {
      name: 'Taiwan',
      iso2: 'TW',
      iso3: 'TWN',
      code: '+886',
      mask: '99 9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/tw.png',
    },
    {
      name: 'Tajikistan',
      iso2: 'TJ',
      iso3: 'TJK',
      code: '+992',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/tj.png',
    },
    {
      name: 'Tanzania, United Republic of',
      iso2: 'TZ',
      iso3: 'TZA',
      code: '+255',
      mask: '9 99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/tz.png',
    },
    {
      name: 'Thailand',
      iso2: 'TH',
      iso3: 'THA',
      code: '+66',
      mask: '9 9999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/th.png',
    },
    {
      name: 'Timor-Leste',
      iso2: 'TL',
      iso3: 'TLS',
      code: '+670',
      mask: '99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/tl.png',
    },
    {
      name: 'Togo',
      iso2: 'TG',
      iso3: 'TGO',
      code: '+228',
      mask: '99 99 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/tg.png',
    },
    {
      name: 'Tonga',
      iso2: 'TO',
      iso3: 'TON',
      code: '+676',
      mask: '99 999',
      flag: 'https://flagpedia.net/data/flags/h80/to.png',
    },
    {
      name: 'Trinidad and Tobago',
      iso2: 'TT',
      iso3: 'TTO',
      code: '+1 868',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/tt.png',
    },
    {
      name: 'Tunisia',
      iso2: 'TN',
      iso3: 'TUN',
      code: '+216',
      mask: '99 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/tn.png',
    },
    {
      name: 'Turkey',
      iso2: 'TR',
      iso3: 'TUR',
      code: '+90',
      mask: '(999) 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/tr.png',
    },
    {
      name: 'Turkmenistan',
      iso2: 'TM',
      iso3: 'TKM',
      code: '+993',
      mask: '9 (999) 999-99',
      flag: 'https://flagpedia.net/data/flags/h80/tm.png',
    },
    {
      name: 'Tuvalu',
      iso2: 'TV',
      iso3: 'TUV',
      code: '+688',
      mask: '99 999',
      flag: 'https://flagpedia.net/data/flags/h80/tv.png',
    },
    {
      name: 'Uganda',
      iso2: 'UG',
      iso3: 'UGA',
      code: '+256',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/ug.png',
    },
    {
      name: 'Ukraine',
      iso2: 'UA',
      iso3: 'UKR',
      code: '+380',
      mask: '99 999 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/ua.png',
    },
    {
      name: 'United Arab Emirates',
      iso2: 'AE',
      iso3: 'ARE',
      code: '+971',
      mask: '99 999 9999',
      flag: 'https://flagpedia.net/data/flags/h80/ae.png',
    },
    {
      name: 'United Kingdom',
      iso2: 'GB',
      iso3: 'GBR',
      code: '+44',
      mask: '99999 999999',
      flag: 'https://flagpedia.net/data/flags/h80/gb.png',
    },
    {
      name: 'United States',
      iso2: 'US',
      iso3: 'USA',
      code: '+1',
      mask: '(999) 999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/us.png',
    },
    {
      name: 'Uruguay',
      iso2: 'UY',
      iso3: 'URY',
      code: '+598',
      mask: '9 99 999 99',
      flag: 'https://flagpedia.net/data/flags/h80/uy.png',
    },
    {
      name: 'Uzbekistan',
      iso2: 'UZ',
      iso3: 'UZB',
      code: '+998',
      mask: '99 999 99 99',
      flag: 'https://flagpedia.net/data/flags/h80/uz.png',
    },
    {
      name: 'Vanuatu',
      iso2: 'VU',
      iso3: 'VUT',
      code: '+678',
      mask: '99 999',
      flag: 'https://flagpedia.net/data/flags/h80/vu.png',
    },
    {
      name: 'Vatican City',
      iso2: 'VA',
      iso3: 'VAT',
      code: '+39',
      mask: '9999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/va.png',
    },
    {
      name: 'Venezuela',
      iso2: 'VE',
      iso3: 'VEN',
      code: '+58',
      mask: '0999-999-9999',
      flag: 'https://flagpedia.net/data/flags/h80/ve.png',
    },
    {
      name: 'Vietnam',
      iso2: 'VN',
      iso3: 'VNM',
      code: '+84',
      mask: '0999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/vn.png',
    },
    {
      name: 'Yemen',
      iso2: 'YE',
      iso3: 'YEM',
      code: '+967',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/ye.png',
    },
    {
      name: 'Zambia',
      iso2: 'ZM',
      iso3: 'ZMB',
      code: '+260',
      mask: '999 999 999',
      flag: 'https://flagpedia.net/data/flags/h80/zm.png',
    },
    {
      name: 'Zimbabwe',
      iso2: 'ZW',
      iso3: 'ZWE',
      code: '+263',
      mask: '71 9999999',
      flag: 'https://flagpedia.net/data/flags/h80/zw.png',
    },
  ];
}

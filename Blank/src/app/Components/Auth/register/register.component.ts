import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  cellphone: any;
  constructor(
    private fb: FormBuilder,
    private user: AuthService,
    private router: Router,
    private token: TokenService
  ) {
    StatusBar.setBackgroundColor({ color: '#3880ff' });
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  public load$: BehaviorSubject<any> = new BehaviorSubject(false);
  userForm!: FormGroup;
  step: number = 1;

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  get f() {
    return this.userForm.controls;
  }

  ngOnInit() {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cellphone: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }


  onSubmit() {
    this.load$.next(true);
    this.user.signup(this.userForm.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.token.token = res.token;
        this.load$.next(false);
        this.router.navigate(['/tab']);
      },
      error: (err: any) => {
        console.log(err);
        this.load$.next(false);
      },
    });
  }
}

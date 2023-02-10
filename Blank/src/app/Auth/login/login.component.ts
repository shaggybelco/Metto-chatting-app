import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private user: AuthService, private router: Router, private token: TokenService){}

  userForm!: FormGroup;

  
  

  get f() { return this.userForm.controls; }

  ngOnInit() {
    this.userForm = new FormGroup({
      cellphone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern("^[0-9]*$")]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit(){
    console.log(this.userForm.value)

    this.user.signin(this.userForm.value).subscribe(
      {
        next: (res: any)=>{
          console.log(res)
          localStorage.setItem('token', res.token);
          this.token.token = res.token;
          this.router.navigate(['/tab']);

        },error: (err: any)=>{
          console.log(err)
        }
      }
    )
  }
}

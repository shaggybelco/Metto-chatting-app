import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

 
  constructor(private fb: FormBuilder, private user: AuthService, private router: Router, private token: TokenService) { }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  userForm!: FormGroup;
  

  get f() { return this.userForm.controls; }

  ngOnInit() {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      cellphone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern("^[0-9]*$")]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit(){
    console.log(this.userForm.value)
    this.user.signup(this.userForm.value).subscribe(
      {
        next: (res: any) => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this.token.token = res.token;
          this.router.navigate(['/tab'])
        },error: (err: any)=>{
          console.log(err)
        }
      }
    )

  }

}

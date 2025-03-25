import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-authorization',
  imports: [ReactiveFormsModule],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss',
})
export class AuthorizationComponent {
  constructor(public service: ApiService, public cookie: CookieService) {

    setTimeout(() => {
      this.isLoggedIn = this.cookie.check('user'); 
      console.log(this.isLoggedIn)
    }, 500);
    
    setTimeout(() => {
      this.applyInfos()
    }, 500);


  }


  applyInfos(){
    this.service.getUser().subscribe({
      next: (data:any) => {
        console.log(data)
        this.userName = data.firstName
        this.lastName = data.lastName
        this.number = data.phone
      },
      error: (err:any) => {
        console.log(err)
      }
    })
  }
  

  public isLoggedIn!: boolean;
  public userName:string = ""
  public lastName:string = ""
  public number: string = ""

  logOut(){
    this.cookie.delete("user")
    this.isLoggedIn = false
    this.service.cookieCheckSender.next(this.isLoggedIn)
  }

  

  public signInInfo: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  public signUpInfo: FormGroup = new FormGroup({
    firstName: new FormControl(""),
    lastName: new FormControl(""),
    age: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl(""),
    address: new FormControl(""),
    phone: new FormControl(""),
    zipcode: new FormControl(""),
    avatar: new FormControl(""),
    gender: new FormControl(""),
  });

  public signUpOn: boolean = true;

  public signInOn: boolean = false;

  
  

  signUp() {
    this.signUpOn = true;
    this.signInOn = false;
  }

  signIn() {
    this.signInOn = true;
    this.signUpOn = false;
  }

  signInLogIn() {
    this.service.signIn(this.signInInfo.value).subscribe({
      next: (data: any) => {
        this.cookie.set('user', data.access_token);
        this.isLoggedIn = true
        this.service.cookieCheckSender.next(this.isLoggedIn)
        this.applyInfos()
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  

  signUpAuth(){
    this.service.postSignUp(this.signUpInfo.value).subscribe({
      next: (data:any) => {
        console.log(data)

      },
      error: (err:any) => {
        console.log(err)
      }
    })
  }
}

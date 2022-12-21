import { Component, OnInit } from '@angular/core';
import {SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements OnInit {
  loginForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedin!: boolean;

  constructor(
    private formBuilder: FormBuilder, 
    private socialAuthService: SocialAuthService,
    private authservice: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });    
    
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = (user != null);
      console.log(this.socialUser);
      this.authservice.googleLogin(user);
    });
  }
//   signInHandler(): void {
//     this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
//       localStorage.setItem('google_auth', JSON.stringify(data));
//       this.router.navigate(['/home']).then();
//       this.authService.googleLogin();
//     });
//   this.profileService.googleProfile();
//   console.log('sent all google stuff');
// }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }

}


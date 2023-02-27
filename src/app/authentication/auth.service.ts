
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { environment } from '../../environments/environment';
import { Profile } from '../profile.model';
import { SocialUser } from '@abacritt/angularx-social-login';
const backendURL = environment.apiURL + "/user/";
const backendURL2 = environment.apiURL + "/profile/";

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new Subject<{profile:any, mode: string}>();
  private profile: Profile[] = [];
  private isAuthenticated = false;
  private token: string = '';

  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private modeEmit = new Subject<{mode: string, profile: any}>();
  private userId: string = '';
  private username: string = '';
  private creator: string = '';
  mode: string = 'create';
  // user = new Subject<User>();

  constructor(private http: HttpClient,
    private router: Router
    ) {
    }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }
   getUsername() {
   const newUsername = localStorage.getItem(this.username);
   if(newUsername && newUsername != undefined) return newUsername;
   return null
   }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getModeEmit() {
    return this.modeEmit.asObservable();
  }
  getUserStatusListener() {
    return this.user.asObservable();
  }
  getProfile() {
   return {...this.user}
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number, message: string, user: AuthData, userId: string}>(backendURL + '/signup', authData)
      .subscribe((response) => {
        this.userId = response.userId;
        this.creator = response.userId;
        sessionStorage.setItem('userId', this.userId);
        sessionStorage.setItem('creator', this.creator);
        sessionStorage.setItem('email', response.user.email.toLowerCase());
        this.setAuthTimer(response.expiresIn);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.mode = 'create';
        const now = new Date();
        const expirationDate = new Date(now.getTime() + response.expiresIn * 18000);
        this.saveAuthData(response.token, expirationDate, response.userId);
        console.log('save auth data', response.token, expirationDate, response.userId)  
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  
  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
    .post<{ token: string; expiresIn: number, userId: string, username: string, user: any}>(
      backendURL + '/signin',
        authData
      ).
      subscribe(response => {
        console.log('response', response.userId)
        if(response.user) {
          sessionStorage.setItem('user', JSON.stringify(response.user));
          const profile_id = response.user._id;
          const token = response.token;
          if (token) {
              this.token = token;
              console.log('Got Token Sign In')
              sessionStorage.setItem('profile_id', profile_id);
              this.userId = response.userId;
              this.creator = response.userId;
              sessionStorage.setItem('userId', this.userId);
              sessionStorage.setItem('creator', this.creator);
              sessionStorage.setItem('username', response.username);
              const expiresInDuration = response.expiresIn;
              this.setAuthTimer(expiresInDuration);
              this.isAuthenticated = true;
              this.authStatusListener.next(true);
              this.mode = 'edit';
              this.user.next({profile: response.user, mode: this.mode});
              const now = new Date();
              const expirationDate = new Date(now.getTime() + expiresInDuration * 18000);
              console.log(expirationDate);
              this.saveAuthData(token, expirationDate, this.userId);
              localStorage.setItem('email', authData.email.toLowerCase());
              this.router.navigate(['/profiles']);
          }
        } else {
            console.log('Sign In')
            const token = response.token;
            this.token = token
            if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.creator = response.userId;
            sessionStorage.setItem('userId', this.userId);
            sessionStorage.setItem('creator', this.creator);
            this.authStatusListener.next(true);
            if(response.username) {
              console.log('Sign In')
              this.user.next({profile: response.user, mode: this.mode});
              this.mode = 'edit';
            } else {
              this.mode = 'create';
              this.user.next({profile: response.user, mode: this.mode});
            }
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 18000);
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            localStorage.setItem('email', authData.email.toLowerCase());
            const email = localStorage.getItem('email');
            this.router.navigate(['/profiles']);
          } else {
            console.log('made it here for some reason');
          } 
        }
      }, error => {
        this.authStatusListener.next(false);
      });
    }
    
    googleLogin(user: SocialUser ) {
      const storage = user;
      let userDetails: any;
      
      if(storage) {
          let userDetails = storage;
          sessionStorage.setItem('userPic', userDetails.photoUrl);
          localStorage.setItem('email', userDetails.email);
          this.http.post<{ message: string, token: string; expiresIn: number, userId: string, username: string, creator: string, user: any}>(
            backendURL + '/socialSignin', userDetails
          )
          .subscribe(response => {
            const user = response.user;
            sessionStorage.setItem('user', JSON.stringify(response.user));
            const token = response.token;
            this.token = token;
            if (token) {
              const expiresInDuration = response.expiresIn;
              this.setAuthTimer(expiresInDuration);
              this.isAuthenticated = true;
              this.username = response.username;
              this.userId = response.userId;
              this.creator = response.userId;
              sessionStorage.setItem('userId', this.userId);
              sessionStorage.setItem('creator', this.creator);
              this.authStatusListener.next(true);
              console.log('auth service response', response.user);
              this.mode = 'edit';
            this.user.next({profile: response.user, mode: this.mode});
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 18000);
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            const email = localStorage.setItem('email', userDetails.email.toLowerCase());
            this.router.navigate(['profiles']);
            }
          }, error => {
            this.authStatusListener.next(false);
          });
      
        } else {
        this.logout();
      }
  
    }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    setTimeout(() => {
      if (!authInformation) {
        return;
      }
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.userId = authInformation.userId!;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
        this.mode = 'edit';
        const profile = sessionStorage.getItem('user') as string;
        this.user.next({profile: profile, mode: this.mode})
      } else {
        this.logout();
        this.authStatusListener.next(false);
      }
    }, 50000);
   
  }

  logout() {
    this.token = null!;
    this.isAuthenticated = false;
    this.userId = null!;
    this.username = null!;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    localStorage.removeItem('google_auth');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expiration');
    localStorage.removeItem('email');
    sessionStorage.clear();
    localStorage.clear();
    this.modeEmit.next({
      mode: 'create',
      profile: {}
    });
    this.router.navigate(['/profiles']);
    this.authStatusListener.next(false);
    }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    sessionStorage.clear();
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    console.log('token in get Auth', token)
    if (!token || !expirationDate) {
      return null;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}

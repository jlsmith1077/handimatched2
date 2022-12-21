import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'
import { ProfileService } from 'src/app/profile.service';


@Component ({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit, OnDestroy {
    private authStatusSub: Subscription = new Subscription;
    isLoading = false;
    emailInput = '';
    constructor(public authService: AuthService, public profileService: ProfileService,
      public router : Router   
      ) {       
        form: NgForm;
      }

ngOnInit(): void {
       this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
           authStatus => {
            this.isLoading = false;
           }
       );
    }

    onLogin(form: NgForm) {
      if (form.invalid) {
        return;
      }
      this.isLoading = true;
      this.authService.login(form.value.email, form.value.password );
    }
    ngOnDestroy() {
      this.authStatusSub.unsubscribe();
    }
}

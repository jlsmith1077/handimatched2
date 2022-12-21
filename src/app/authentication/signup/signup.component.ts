import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component ({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    isLoading = false;
    emailInput = '';
    
    constructor(public authService: AuthService) {
      form: NgForm;

    }

    ngOnInit() {
    //    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
    //        authStatus => {
    //         this.isLoading = false;
    //        }
    //    );
    }

    onSignup(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.createUser(form.value.email, form.value.password);
        localStorage.setItem('email', form.value.email);
        
    }
    ngOnDestroy() {
        // this.authStatusSub.unsubscribe();
    }
}

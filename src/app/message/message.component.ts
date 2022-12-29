import { Component, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { MailService } from './mail.service';
import { Mail } from './mail.model';
import { ActivatedRoute } from '@angular/router';
import { TransitionCheckState } from '@angular/material/checkbox';
import { AuthService } from 'src/app/authentication/auth.service';
import { Profile } from '../profile.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  username!: string;
  userpic!: string;
  currentDateAndTime: any = {};
  form!: FormGroup;
  enteredContent!: '';
  id!: string;
  private mailSub!: Subscription;
  private user!: Subscription;
  private profile!: Profile;
  mails: Mail[] = [];
  mail!: string;
  openMail = false;
  opened!: string;
  private isOpen = new Subject<boolean>();
  @Output() mode = new Subject<string>(); 

  constructor(private http: HttpClient,
              private mailservice: MailService,
              private authService: AuthService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.authService.getUserStatusListener().subscribe(returnData => {
      this.profile = returnData.profile;
      this.username = returnData.profile.username;
    })
    this.userpic = sessionStorage.getItem('userPic') as string;
    this.currentDateAndTime = new Date().toLocaleString();
    console.log('currentDateAndTime', this.currentDateAndTime);
    this.form = new FormGroup({
      content1: new FormControl(null, {validators: [Validators.required]} )
    });
    this.mailservice.getMails();
    this.mailSub = this.mailservice.getMailUpdateListener()
      .subscribe((mails: Mail[]) => {
        this.mails = mails;
      });
      console.log('Mails', this.mails);
      this.route.fragment.subscribe((fragment) => { 
        if (fragment && document.getElementById(fragment) != null) {
          document.getElementById(fragment)!.scrollIntoView({ behavior: "smooth" });
        }
      });
  }

  onCancel() {
    this.mode.next('login');
    this.isOpen.next(false);
    //this.router.navigate(['/']);
  }

  onCreateMail() {
    const messageTime = this.currentDateAndTime;
    this.mode.next('create');
    if (this.form.invalid) {
      return;
    }
    const opened = 'false';
    this.id = localStorage.getItem('id') as string;
    const userpic = this.userpic;
    const receiver = sessionStorage.getItem('receiver') as string;
    const receivername = sessionStorage.getItem('receivername') as string;
    const username = sessionStorage.getItem('username') as string;
    console.log('username in message ts', username);
    const creator = localStorage.getItem('userId') as string;
    this.mailservice.createMail({ content1: this.form.value.content1, creator, receiver, username, receivername, messageTime, userpic, opened, repliesAmt: null });
    this.form.reset();
    this.mode.next('login');
  }
  // fetchMessages() {
  //   this.openMail = true;
  // }
  // clearMessages() {
  //   this.openMail = false;
  // }

  onClearMail() {
    // Send Http request
  }

ngOnDestroy() {
  this.mailSub.unsubscribe();
}

}

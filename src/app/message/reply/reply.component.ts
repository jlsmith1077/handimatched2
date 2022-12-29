import { Component, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { ReplyService } from './reply.service';
import { MailService } from '../mail.service';
import { Reply } from './reply.model';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {
  @Input() mailId!: string;
  currentDateAndTime!: {};
  form!: FormGroup;
  enteredContent: string = '';
  id!: string;
  private replySub!: Subscription;
  replies: Reply[] = [];
  reply!: string;
  openReply = false;
  @Output() mode = new Subject<string>(); 

  constructor(private http: HttpClient,
              private replyservice: ReplyService,
              private mailService: MailService
              ) {}

  ngOnInit() {
    this.currentDateAndTime = new Date().toLocaleString();
    this.form = new FormGroup({
      content1: new FormControl(null, {validators: [Validators.required]} )
    });
  }

  onCancel() {
    this.mode.next('login');
    //this.router.navigate(['/']);
  }

  onCreateReply() {
    const messageTime = this.currentDateAndTime;
    this.mode.next('create');
    console.log(this.mode);
    if (this.form.invalid) {
      return;
    }
    this.id = localStorage.getItem('id') as string;

    const receivername = sessionStorage.getItem('userReplyName') as string;
    const mailId = sessionStorage.getItem('mailId') as string;
    const mailState = 'false';
    const username = sessionStorage.getItem('username') as string;
    const creator = sessionStorage.getItem('creator') as string;
    this.replyservice.createReply({ content1: this.form.value.content1, creator, mailId, username, receivername, messageTime });
    this.mailService.opendedState(mailState, mailId);
    console.log('mail state', mailState, mailId)
    this.form.reset();
    this.mode.next('login');
  }

  onClearMail() {
    // Send Http request
  }

ngOnDestroy() {
}

}

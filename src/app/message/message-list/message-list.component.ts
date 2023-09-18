import { Component, OnInit, OnDestroy, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MailService } from '../mail.service';
import { Mail } from '../mail.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Profile } from '../../profile.model';
import { ProfileService } from '../../profile.service';
import { MatExpansionPanel } from '@angular/material/expansion'
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy, AfterViewInit {
  enlargeImage: Boolean = false;
  enlargeVideo: Boolean = false;
  private mailSub: Subscription = new Subscription;
  private subProfile: Subscription = new Subscription;
  userPosition!: number;
  public mode = 'login';
  public modeReply = 'off';
  public openCheck = 'open';
  mails: Mail[] = [];
  constantMail: Mail[] = [];
  newMails: Mail[] = [];
  conversations: string[] = [];
  id!: string;
  username!: string;
  creator!: string;
  receiver!: string;
  receivername: string = '';
  receiverCreator: string = '';
  users: Profile[] = [];
  @Input() myMail: Mail[] = [];
   mailId!: string;
  @Input()
  mail!: Mail;
  @Input()
  index!: number;
  isLoading = false;
  totalPosts!: number;
  sortLists: [] = [];
  selectedSort!: string;
  userPic!: string;
  mailState!: string;
  userOpenMailofUserlength!: number;
  userOpenMailofUser!: string | undefined;
  @ViewChild('panel1')
  isMobile!: number;
  panel!: string;

  constructor(private mailservice: MailService,
              private profileService: ProfileService,
              private router: Router,
              private route: ActivatedRoute,        
      ) { }

  ngOnInit(): void {
    this.isMobile = window.innerWidth;
    this.username = sessionStorage.getItem('username') as string;
    this.creator = sessionStorage.getItem('creator') as string;
    this.id = localStorage.getItem('userId') as string;
      this.mailSub = this.mailservice.getMailUpdateListener()
      .subscribe((mails: Mail[]) => {
        console.log('Mail updated!!')
        this.constantMail = [...mails].reverse();
        this.mails = [...mails].reverse();
        // const defaultConvoIndex = this.mails[0];
        this.newMails = [...this.mails].filter(mail => mail.creator == this.creator && mail.opened == 'true')
        this.receivername = this.mails[0]?.receivername;
        if(this.receivername == this.username){
          this.receivername = this.mails[0]?.username
        }
        this.receiverCreator = this.mails[0]?.receivername;
        this.getConversations([...this.mails]);
        this.choseConvo(this.receivername);
        // const sentMail = this.mails.filter(mail => mail.username == this.username)
        // const incomingMail = this.mails.filter(mail => mail.receivername == this.username);
     });     
     this.mailservice.getMails();
  }

  ngAfterViewInit(): void {
    this.mailSub = this.mailservice.getMailUpdateListener()
      .subscribe((mails: Mail[]) => {
        console.log('Mail updated!!')
        this.constantMail = [...mails].reverse();
        this.mails = [...mails].reverse();
        const defaultConvoIndex = this.mails[0];
        this.receivername = this.mails[0]?.receivername;
        if(this.receivername == this.username){
          this.receivername = this.mails[0]?.username
        }
        this.receiverCreator = this.mails[0]?.receivername;
        this.getConversations([...this.mails]);
        this.choseConvo(this.receivername);
        // const sentMail = this.mails.filter(mail => mail.username == this.username)
        // const incomingMail = this.mails.filter(mail => mail.receivername == this.username);
     }); 
  }

  getExtension(fileName: string | File) {
    let fileExt;
    if(typeof fileName == 'string' ) {
      fileExt = fileName.split('.').pop();
    } console.log('file extension', fileExt)
    if(fileExt == 'png' || 'jpg' || 'gif' && fileExt){
      return 'image'
    } 
    if(fileExt == 'mov' || 'wmv' || 'webm' || 'm3u8' || 'ts' || 'ogg' || 'JPEG' || 'MPV'|| '3gpp' || '3gpp2' || 'flv' || 'avi' && fileExt) {
      console.log('in video')
      return 'video'
    } else {
      return
    }
  }
  
  choseConvo(receivername: string){
    this.receivername = receivername;
    this.mails = [...this.constantMail].filter(mail => mail.receivername == receivername || mail.username == receivername)
     }
  getConversations(mails: Mail[]) {
    mails.forEach(mail => {
      if(mail.username == this.username && this.conversations.includes(mail.receivername) == false && this.username != mail.receivername) {
        this.conversations.push(mail.receivername )
      } else if(mail.receivername == this.username && this.conversations.includes(mail.username) == false && this.username != mail.username)   {
        this.conversations.push(mail.username)
      }
    })
  }

  getMails() {
    this.mailservice.getMails();
  }
  getSentMail(mail: Mail) {
    if(mail.receivername == this.username) {
      if(this.conversations.indexOf(mail.receivername) < 0) {
        this.conversations.push(mail.receivername);
      }
    }
  }
  getIncomingMail(mail: Mail) {
    if(mail.username == this.username) {
      if(this.conversations.indexOf(mail.receivername) < 0) {
        this.conversations.push(mail.username);
      }
    }
  }
  mailOpened(mailState: string, id: any, username: string) {
  }
  onCancel() {
    this.mode = 'login'
  }
  
  deleteMessage(id: string) {
    console.log(id);
    this.mailservice.deleteMail(id);
  }
  
  ngOnDestroy() {
    this.mailSub.unsubscribe();
    this.subProfile.unsubscribe();
    // this.openStateSub.unsubscribe();
  }
  
  }

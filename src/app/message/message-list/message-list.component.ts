import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { MailService } from '../mail.service';
import { Mail } from '../mail.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Profile } from '../../profile.model';
import { ProfileService } from '../../profile.service';
import { ReplyService } from '../reply/reply.service';
import { Reply } from '../reply/reply.model';
import { MatExpansionPanel } from '@angular/material/expansion';




@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  private mailSub: Subscription = new Subscription;
  private openStateSub: Subscription = new Subscription;
  private replySub: Subscription = new Subscription;
  private subProfile: Subscription = new Subscription;
  userPosition!: number;
  public mode = 'login';
  public modeReply = 'off';
  public openCheck = 'open';
  usersMail: Mail[] = [];
  incomingMail: Mail[] = [];
  usersMailLength!: number;
  mails: Mail[] = [];
  replies: Reply[] = [];
  incReplies: Reply[] = [];
  outReplies: Reply[] = [];
  sendeeMail: Mail[] = [];
  profiles: Profile[] = [];
  senders: Profile[] = [];
  sender!: Profile;
  sendee!: Profile;
  sendees: Profile[] = [];
  id!: string;
  username!: string;
  creator!: string;
  receiver!: string;
  receivername!: string;
  users: Profile[] = [];
  @Input() myMail: Mail[] = [];
  @Input() myReply: Reply[] = [];
   mailId!: string;
  myMailPeople: Mail[] = [];
  sentMailPeople: Mail[] = [];
  sentMail: Mail[] = [];
  @Input()
  mail!: Mail;
  @Input()
  index!: number;
  isLoading = false;
  totalPosts!: number;
  myMailLength!: number;
  sntMailLength!: number;
  incMsg: any;
  sortLists: [] = [];
  selectedSort!: string;
  usernames: string[] = [];
  mailUsernames: string[] = [];
  userMail: boolean = false;
  userOpenMail: string[] = [];
  userOpenMailNumber!: number;
  userOpenMailName!: string;
  openMail!: number;
  openMailIndex!: number;
  openedMail: string[] = [];
  userMailName!: string;
  userPic!: string;
  mailState!: string;
  userOpenMailofUserlength!: number;
  userOpenMailofUser!: string | undefined;
  @ViewChild('panel1')
  isMobile!: number;
  panel!: string;

  constructor(private mailservice: MailService,
              private profileService: ProfileService,
              private replyService: ReplyService,
              private router: Router,
              private route: ActivatedRoute,        
      ) { }

  ngOnInit(): void {
    this.isMobile = window.innerWidth;
    this.userMail = false;
    this.username = sessionStorage.getItem('username') as string;
    this.creator = sessionStorage.getItem('creator') as string;
    this.id = localStorage.getItem('userId') as string;

//getting users mail
      this.mailSub = this.mailservice.getMailUpdateListener()
      .subscribe((mails: Mail[]) => {
        this.mails = mails;
        this.sentMail = this.mails.filter(mail => mail.creator === this.id).reverse();
        this.myMail = this.mails.filter(mail => mail.receiver || mail.creator === this.creator).reverse();
        this.usersMail = this.myMail.filter(mail => mail.receiver === this.creator);
        this.incomingMail = this.mails.filter(mail => mail.creator != this.creator && mail.receiver === this.creator).reverse();
        this.myMailPeople = this.myMail.filter(myMail => myMail.creator === myMail.creator).reverse();
        this.sentMailPeople = this.myMail.filter(myMail => myMail.receiver === myMail.receiver).reverse();
        this.myMail?.filter(mail => {
          if(mail.receiver && mail.creator != this.creator) {
            const mailUsername = mail.username;
            this.usernames.push(mailUsername);
            
          }  
          if(mail.creator === this.creator) {
            this.usernames.push(mail.receivername);
          }
        });
        if(this.openCheck === 'open') {
              this.mailUsernames = [...new Set(this.usernames)];
              this.myMail.filter(mail => {
                if(mail.opened === 'false' && mail.receiver === this.creator) {
                  this.openedMail.push(mail.username);
                }
              });
        }
        this.userOpenMail = [...new Set(this.openedMail)];
        this.userOpenMailNumber = this.userOpenMail.length;
     });
     this.mailservice.getMails();
    this.subProfile = this.profileService.getProfileUpdateListener()
    .subscribe((profileData: {profiles: Profile[]}) => {
      this.isLoading = false;
      this.profiles = profileData.profiles;
   });
  // this.openStateSub = this.mailservice.getOpenedStateUpdateListener()
  //   .subscribe(resData => {
  //     this.openCheck = 'closed';
  //     this.userOpenMail = resData;
  //     this.userOpenMailNumber = this.userOpenMail.length;
  //  });
  }
  
  getMails() {
    this.mailservice.getMails();
  }

  mailOpened(mailState: string, id: any, username: string) {
    if(mailState === 'false') {
      mailState = 'true';
      this.usersMail.find(mail => {
        if(mail.username === username){
          this.openMailIndex = this.userOpenMail.indexOf(username);
          this.mailservice.updateOpendedState(mailState, id, this.userOpenMail, this.openMailIndex);
        }
      });    
      mailState = 'true';
    }
  }
  
    getUserMail(mailState: string, id: string, username: string) {
      this.userMailName = username;
      this.usersMail = this.myMail.filter(mail => mail.receiver === this.creator);
      const sentuserMail = this.sentMail.filter(mail => mail.receivername === username);
      this.usersMail = [...this.usersMail, ...sentuserMail];
      this.userMail = true;
      this.usersMailLength = this.usersMail.length; 
      this.usersMail.find(mail => {
        if(mail.username === username){
          this.openMailIndex = this.userOpenMail.indexOf(username);
          this.mailservice.updateOpendedState(mailState, id, this.userOpenMail, this.openMailIndex);
        }
      });
      this.userOpenMailofUser = this.userOpenMail.find(user => user === username);
      let openMailofUser = this.userOpenMail.filter(user => user === username);
      if(openMailofUser) {
        this.userOpenMailofUserlength = openMailofUser.length;
      }

    console.log('usersMail', this.usersMail);
  }

  allMail() {
    this.userMail = false;
  }
  
    findUser(username: string) {
      this.userPosition = this.profiles.findIndex(profile => profile.username === username);
      this.router.navigate(['/home/' + this.userPosition ]);
    }
    
    groupBy1() {
      for(let mailEl of this.myMail) {
        for(let replyEl of this.myReply) {
          if(mailEl.id === replyEl.mailId ) {                
          }
        }
      }
    }
    
    badgeNumber(creator: string) {
      this.sendeeMail = this.myMail.filter(mail => mail.creator === creator);
      this.myMailLength = this.sendeeMail.length;
    }
    badgeNumber2(receiver: string) {
      const badge = this.sentMail.filter(mail => mail.receiver === receiver);
      this.sntMailLength = badge.length;
    }
  onClearMail() {
    // Send Http request
  }

  onReply(username: string, mailId: string, receiver: string) {
    console.log('reply information', username, mailId, receiver);
    sessionStorage.setItem('receiver', receiver);
    sessionStorage.setItem('userReplyName', username);
    sessionStorage.setItem('mailId', mailId);
    // this.firstPanel.close();
    this.mode = 'create';
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

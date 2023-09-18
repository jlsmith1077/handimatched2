import { Mail } from './mail.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router'
import { environment }from '../../../src/environments/environment';

const backendURL = environment.apiURL + '/mail/';


@Injectable({providedIn: 'root'})
export class MailService {
    username = sessionStorage.getItem('username');
    private userOpenMail?: string[];
    private userOpenMailIndex?: number;
    private mails: Mail[] = [];
    private newMails: Mail[] = [];
    private mailUpdated = new Subject<Mail[]>();
    private newMailUPdated = new Subject<Mail[]>();
    private isOpen = new Subject<boolean>();
    private openedUpdated = new Subject<string[]>();

    constructor(private http: HttpClient,
                private router: Router          
        ) {}
    getMails() {
        const creator  = sessionStorage.getItem('creator') as string;
        const username = sessionStorage.getItem('username') as string;
        console.log('username', username)
        const mailData = {creator, username}
        this.http.patch<{
          message: string,
          mail: Mail[]
        }>(backendURL, mailData)
        .subscribe(mailData => {
          this.mails = mailData.mail;
          this.mailUpdated.next([...this.mails]);
          this.newMails = [...this.mails].filter(mail => mail.creator == creator && mail.opened == 'true')
          this.newMailUPdated.next(this.newMails);
          // console.log('new user mail', this.newMails.length);
        });
      }
      getNewMail() {
        const creator  = sessionStorage.getItem('creator') as string;
        let userMail: Mail[] = this.getMailbyId(creator);
        let newMail: Mail[] = [];
        userMail = this.getMail(creator);
        console.log('user mail', userMail);
        userMail.filter(mail => {
          if(mail.opened == 'true') {
            console.log('it was true')  
            this.newMails.push(mail);
          }
        })
        // return {...userMail.filter(mail => mail.opened == 'true')}
      }
      getNewMailListener() {
        return this.newMailUPdated.asObservable();
      }
      getOpenedStateUpdateListener() {
        return this.openedUpdated.asObservable();
      }
      getMailUpdateListener() {
        return this.mailUpdated.asObservable();
      }
      getIsOpenListner() {
        return this.isOpen.asObservable();
      }
      createMail( content1: string, creator: string,
          receiverCreator: string, username: string,
          receivername: string, messageTime: object,
          userpic: string, messageImages: File[],
          messageVideo: File,
          opened: string 
          ) {
        // tslint:disable-next-line: object-literal-shorthand
        console.log('userpic creatig message', userpic);
        const mailData  = new FormData();
        mailData.append('content1', content1)
        mailData.append('creator', creator)
        mailData.append('receiverCreator', receiverCreator)
        mailData.append('username', username)
        mailData.append('receivername', receivername)
        mailData.append('messageTime', JSON.stringify(messageTime))
        mailData.append('userpic', userpic)
        for (let messageImage  of messageImages) {
          mailData.append('images', messageImage)
          console.log('messageImage', messageImage)
        }
        // Array.from(messageImages).forEach(image => mailData.append('images', image, image.name))
        if(messageVideo) {
          mailData.append('video', messageVideo)
          } else {
            mailData.append('video', '');
          }
        mailData.append('opened', JSON.stringify(opened))
        const mail: Mail = {_id: null, content1: content1, creator: creator,  receiverCreator: receiverCreator, username: username, receivername: receivername, messageTime: messageTime, userpic: userpic, messageImages, messageVideo, opened: opened  };
        console.log('mail from service', mailData);
          console.log('in video mail service')
          this.http.post<{message: string, mail: Mail }>(backendURL, mailData)
          .subscribe(responseData => {
            console.log('response data', responseData.message)
            this.mails.push(mail);
            this.mailUpdated.next([...this.mails]);
            this.newMails = [...this.mails].filter(mail => mail.creator == creator && mail.opened == 'true')
            this.newMailUPdated.next(this.newMails);
            this.isOpen.next(false);
            sessionStorage.setItem('username', mail.username);
          });
      }
      getMail(id: string) {  // id is profile.creator
        return {...this.mails.filter(mail => mail.creator === id)};
      }
      getMailbyId(id: string) {
        return {...this.mails.filter(mail => mail._id === id)};
      }


    updateOpendedState(mailState: any, id: string, usernames: string[], index: number | undefined) {
      console.log('mailstate', mailState);
      this.userOpenMail = usernames;
      this.userOpenMailIndex = index;
      this.http.put<{
        message: string,
        mail: Mail[]
      }>( backendURL + id, mailState)
      .subscribe(responseData => {
        if(this.userOpenMail!.length > -1){
            this.userOpenMail!.splice(this.userOpenMailIndex!, 1);
            this.openedUpdated.next([...this.userOpenMail!]);
        }
      });
      
    }
    opendedState(mailState: any, id: string) {
      this.http.patch<{
        message: string
      }>( backendURL + id, mailState)
      .subscribe(responseData => {
        if(this.userOpenMail && this.userOpenMail.length > -1){
            this.userOpenMail.splice(this.userOpenMailIndex!, 1);
            this.openedUpdated.next([...this.userOpenMail]);
        }
      });
      
    }

    deleteMail(mailId: string) {
      this.http.delete( backendURL + mailId)
      .subscribe(()=> {
        this.mailUpdated.next([...this.mails]);
      });
    }
}

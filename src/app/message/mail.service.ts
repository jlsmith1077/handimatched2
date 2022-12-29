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
    private mailUpdated = new Subject<Mail[]>();
    private isOpen = new Subject<boolean>();
    private openedUpdated = new Subject<string[]>();

    constructor(private http: HttpClient,
                private router: Router          
        ) {}
    getMails() {
        this.http.get<{
          message: string,
          mail: any
        }>(backendURL)
        .pipe(map((mailData) => {
          return mailData.mail.map((mail: { content1: any; creator: any; receiver: any; username: any; receivername: any; _id: any; messageTime: any; userpic: any; opened: any; repliesAmt: any; }) => {
            return {
              content1: mail.content1,
              creator: mail.creator,
              receiver: mail.receiver,
              username: mail.username,
              receivername: mail.receivername,
              id: mail._id,
              messageTime: mail.messageTime,
              userpic: mail.userpic,
              opened: mail.opened,
              repliesAmt: mail.repliesAmt
            };
          });
        }))
        .subscribe(transformedComment => {
          this.mails = transformedComment;
          this.mailUpdated.next([...this.mails]);
        });
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
      createMail({ content1, creator, receiver, username, receivername, messageTime, userpic, opened, repliesAmt }: { content1: string; creator: string; receiver: string; username: string, receivername: string, messageTime: object, userpic: string, opened: string, repliesAmt: null }) {
        // tslint:disable-next-line: object-literal-shorthand
        const mail: Mail = {id: null, content1: content1, creator: creator, receiver: receiver, username: username, receivername: receivername, messageTime: messageTime, userpic: userpic, opened: opened, repliesAmt };
        console.log('mail from service', mail);
        this.http.post<{ mail: Mail }>(backendURL, mail)
        .subscribe(responseData => {
          this.mails.push(mail);
          this.mailUpdated.next([...this.mails]);
          this.isOpen.next(false);
          sessionStorage.setItem('username', mail.username);
        });
      }
      getMail(id: string) {  // id is profile.creator
        return {...this.mails.find(mail => mail.creator === id)};
      }
      getMailbyId(id: string) {
        return {...this.mails.find(mail => mail.id === id)};
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

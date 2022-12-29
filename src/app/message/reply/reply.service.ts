import { Reply } from '../reply/reply.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../src/environments/environment.prod';
import { MailService } from '../mail.service';

const backendURL = environment.apiURL + '/reply/';
const backendURL2 = environment.apiURL + '/replies/';


@Injectable({providedIn: 'root'})
export class ReplyService {
    private replies: Reply[] = [];
    private replyUpdated = new Subject<Reply[]>();
    private replyCopy: Reply[] = [];

    private userOpenMail?: string[];
    private openedUpdated = new Subject<string[]>();
    private userOpenMailIndex?: number;


    constructor(private http: HttpClient,
                private mailService: MailService    
        ) {}
    getReplies() {
        this.http.get<{
          message: string,
          reply: any
        }>(backendURL)
        .pipe(map((replyData) => {
          return replyData.reply.map((reply: { content1: any; creator: any; mailId: any; username: any; receivername: any; _id: any; messageTime: any; }) => {
            return {
              content1: reply.content1,
              creator: reply.creator,
              mailId: reply.mailId,
              username: reply.username,
              receivername: reply.receivername,
              id: reply._id,
              messageTime: reply.messageTime
            };
          });
        }))
        .subscribe(transformedReply => {
          this.replies = transformedReply;
          this.replyCopy =  this.replies;
          this.replyUpdated.next([...this.replies])
        });
        }

        incReplyGroup(mailId: string, reply: any) {
          let incReplies: Reply[] = [];
          const creator = sessionStorage.getItem('userReplyName');
          const myReply = this.replies.filter(replies => replies.receivername === creator);
          incReplies = myReply.filter(myReply => myReply.mailId === mailId);
        }

        sentReplyGroup(mailId: string, reply: any) {
          let prefilterReplies: any;
          let outReplies: Reply[] = [];
          const creator = sessionStorage.getItem('userReplyName');
          const myReply = this.replies.filter(replies => replies.username === creator);
          outReplies = myReply.filter(myReply => myReply.mailId === mailId); 
        }

    getReplyUpdateListener() {
        return this.replyUpdated.asObservable();
    }
    createReply({ content1, creator, mailId, username, receivername, messageTime }: { content1: string; creator: string; mailId: string; username: string, receivername: string, messageTime: object }) { 
      const id: string = mailId;       
      const reply: Reply = {id: null, content1: content1, creator: creator, mailId: mailId, username: username, receivername: receivername, messageTime: messageTime };
      this.http.put( backendURL2, reply)
      .subscribe(responseData => {
        this.mailService.getMails();
      });
        username = sessionStorage.getItem('userReplyName') as string;
        receivername = sessionStorage.getItem('username') as string;
        mailId = sessionStorage.getItem('mailId')as string;
        // tslint:disable-next-line: object-literal-shorthand
        this.http.post<{ reply: Reply }>( backendURL , reply)
        .subscribe(responseData => {
        this.replies.push(reply);
        this.replyUpdated.next([...this.replies]);
        });
    }
     getReply(id: string) {  // id is profile.creator
     return {...this.replies.find(reply => reply.creator === id)};
    }
    getReplybyId(id: string) {
      return {...this.replies.find(reply => reply.id === id)};
    }

    deleteReply(replyId: string) {
      this.http.delete( backendURL + replyId)
      .subscribe(()=> {
        console.log('Deleted!')
      });
    }
}

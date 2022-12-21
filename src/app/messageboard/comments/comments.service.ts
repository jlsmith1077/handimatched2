import { Comment } from '../comment.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../src/environments/environment.prod';
import { MessagePostService } from '../message-post.service'

const backendURL = environment.apiURL + '/comments/';


@Injectable({providedIn: 'root'})
export class CommentsService {
    id: string = '';
    username: string = '';
    comment: string = '';
    postId: string = '';
    private comments: Comment[] = [];
    private commentUpdated = new Subject<Comment[]>();

    constructor(private http: HttpClient,
                private router: Router,
                private postService: MessagePostService
        ) {}
    getComments() {
        this.http.get<{
          message: string,
          comments: any
        }>(backendURL)
          .pipe(map((commentData) => {
            return commentData.comments.map((comment: { username: any; comment: any; creator: any; postId: any; _id: any; }) => {
              return {
                username: comment.username,
                comment: comment.comment,
                creator: comment.creator,
                postId: comment.postId,
                id: comment._id
              };
            });
          }))
          .subscribe(transformedComment => {
            this.comments = transformedComment;
            this.commentUpdated.next([...this.comments]);
          });
        }
      // .pipe(map(mailData => {
      //   return {
      //     mails: mailData.mails.map(mail => {
      //     return {
      //       content1: mail.content1,
      //       creator: mail.creator,
      //       receiver: mail.receiver,
      //       id: mail._id
  //       }),
  //     };
  //   })
  // )
      // .subscribe(transformedMailsData => {
      //   this.mails = transformedMailsData.mails;
      //   this.mailUpdated.next({
      //     mails: [...this.mails],
      //     mailCount: transformedMailsData.maxMails
      //   });
      // });

    getCommentUpdateListener() {
        return this.commentUpdated.asObservable();
    }
    createComment(id: string, comment: string, postId: string ) {
        const PPP = sessionStorage.getItem('postPerPage') as string;
        const CP = sessionStorage.getItem('currentPage') as string;
        const postPerPage = JSON.parse(PPP) ;
        const currentPage = JSON.parse(CP);
        const commentData: Comment = {id, comment, commentor: '', postId};
        this.http.put<{
        }>(backendURL, commentData)
        .subscribe(responseData => {
        console.log(responseData);
        this.comments.push(commentData);
        this.commentUpdated.next([...this.comments]);
        this.postService.getMessagePosts();
        });
    }
     getComment(id: string) {  // id is profile.creator
     return {...this.comments.find(comment => comment.commentor === id)};
    }
    getCommentById(id: string) {
      return {...this.comments.find(comments => comments.id === id)};
    }

    deleteComment(postId: string) {
      this.http.delete( backendURL + postId)
      .subscribe(() => {
        this.commentUpdated.next([...this.comments]);
        console.log('Deleted!');
      });
    }
}

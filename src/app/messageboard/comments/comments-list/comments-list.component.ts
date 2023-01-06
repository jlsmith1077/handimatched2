import { Component, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { CustomPaginator } from '../../customPagination';

import { Subscription, Subject } from 'rxjs';
import { MessagePostService } from '../../message-post.service';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Comment } from '../../comment.model';
import { Post } from '../../message-post.model';
import { CommentsService } from '../comments.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css']
})
export class CommentsListComponent implements OnInit {
 private commentSub: Subscription = new Subscription; 
 private postSub: Subscription = new Subscription; 
 private postSub2: Subscription = new Subscription; 
 posts: Post[] = [];
 totalPosts: number | undefined;
 creator: string | undefined;
 username: string | undefined;
 postId: string | undefined;
 comment: Comment | undefined;
 postComments: Comment[] =[];
 commentsLength: number  | undefined;
 @Output() commentOff = new Subject<string>();
 @Output() listOn = new Subject<any>();
 @Input() comments: Comment[] = [];
 @Input() index!: number;


  constructor(private commentService: CommentsService, private postsService: MessagePostService) { }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') as string;
    this.postId = sessionStorage.getItem('postId') as string;
    const id = localStorage.getItem('userId') as string;
    // this.postSub = this.postsService.getPostUpdateListener()
    // .subscribe((postData: any) => {
    //       this.posts = postData.posts;
    //     });
  }

  onDelete(id: string) {
    this.commentService.deleteComment(id);
  }

  ngOnDestroy() {
    sessionStorage.removeItem('postId');
    this.postSub.unsubscribe();
    this.listOn.next(false);
  }

}

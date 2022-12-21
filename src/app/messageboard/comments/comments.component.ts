import { Component, OnInit, OnDestroy, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { from, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../comment.model';
import { CommentsService } from './comments.service';
import { MessagePostService } from '../message-post.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
username: string | undefined;
isLoading = false;
form!: FormGroup;
enteredContent:  string | undefined;
private commentSub: Subscription = new Subscription;
comments: Comment[] = [];
comment:  string | undefined;
mode:  string | undefined;
@Output() commentOff = new Subject<string>();
totalPosts = 0;
postsPerPage = 10;
currentPage = 1;

  constructor( private http: HttpClient, private commentsService: CommentsService, private mpService: MessagePostService) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') as string;
    this.form = new FormGroup({
      username: new FormControl(this.username),
      comment: new FormControl(null, {validators: [Validators.required]})
    });
  }
onSaveComment() {
  if (this.form!.invalid) {
    return;
  }
  const commentor = sessionStorage.getItem('username');
  const id = sessionStorage.getItem('postId') as string;
  const creator = localStorage.getItem('creator') as string;
  this.mpService.addComment( id, this.form!.value.comment );
  this.onCommentOff();
  this.form!.reset();
}

onCommentOff() {
  this.commentOff.next(this.mode = 'login');
}
ngOnDestroy() {
}
}

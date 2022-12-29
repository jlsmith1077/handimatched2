import { Component, OnInit, OnDestroy, Input, Output, ViewChild } from '@angular/core';
import { ReplyService } from '../reply.service';
import { Reply } from '../reply.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../profile.service';
import { Mail } from '../../../message/mail.model';
import { MailService } from '../../../message/mail.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { Profile } from 'src/app/profile.model';
import { MatSort } from '@angular/material/sort';
import { CustomPaginator } from './customPagination';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-reply-list',
  templateUrl: './reply-list.component.html',
  styleUrls: ['./reply-list.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() }
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ReplyListComponent implements OnInit,  OnDestroy {
private mailSub!: Subscription;
username!: string;
replies: Reply[] = [];
mails: Mail[] = [];
outReplies: Reply[] = [];
messageReply: Reply[] = [];
incReplies: Reply[] = [];
sentMail1: Mail[] = [];
myMail: Mail[] = [];
@Input() mail!: Mail;
@Input() sentMail!: Mail;
@Input() mode!: string;

dataSource!: MatTableDataSource<any>;

  columnsToDisplay: string[] = ['content1', 'username',  'receivername'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Profile | null | undefined;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(private replyservice: ReplyService,
              private profileService: ProfileService,
              private mailservice: MailService,
              private router: Router,
              private route: ActivatedRoute,        
      ) { }

  ngOnInit(): void {
    const username = sessionStorage.getItem('username');
    this.replyservice.getReplies();
    this.replyservice.getReplyUpdateListener()
      .subscribe((replies: Reply[]) => {
        this.replies = replies.reverse();
        this. dataSource = new MatTableDataSource(this.replies);
        });
        this.outReplies = this.replies.filter(replies => replies.mailId === this.mail.id).reverse();
       }
    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
  }
}

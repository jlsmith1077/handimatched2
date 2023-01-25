import { Component, OnInit,  OnDestroy, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subscription, Subject, BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MessagePostService } from './message-post.service';
import { Post } from './message-post.model';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../authentication/auth.service';
import { ProfileService } from '../profile.service';
import { CommentsService } from './comments/comments.service';
import { LikeService } from '../like/like.service';
import { Like } from '../like/like.model';
import { Profile } from '../profile.model';
import { Comment } from './comment.model';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { map } from 'rxjs/operators';
import { MatExpansionPanel } from '@angular/material/expansion';

import { CustomPaginator } from '../messageboard/customPagination'
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
// import { MailService } from '../profiles/message/mail.service';


@Component({
  selector: 'app-messageboard',
  templateUrl: './messageboard.component.html',
  styleUrls: ['./messageboard.component.css'],
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
export class MessageboardComponent implements OnInit, OnDestroy {
  postChoice = ['Casual Dating', 'Relationship Dating'];
  postSection = ['men and women', 'women and women', 'men and men' ];
  selectedChoice: string = '';
  selectedSection: string = '';
  hidden = false;
  post: any = Post;
  pst: any;
  cmts: any;
  posts: Post[] = [];
  comments: Comment[] = [];
  myComment: Comment[] = [];
  isLoading = false;
  commentsLength: number | undefined;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userPic: string | undefined;
  userId: string | undefined;
  username: string | undefined;
  userPosition: number | undefined;
  private postsSub: Subscription = new Subscription;
  private likesSub: Subscription = new Subscription;
  private modeSub: Subscription = new Subscription;
  authStatusSub: Subscription = new Subscription;
  private commentSub: Subscription = new Subscription;
  userPostsStatus: Subscription = new Subscription;
  comment: Comment | undefined;
  commentsReceived = false;
  profile: Profile | undefined;
  profiles: Profile[] = [];
  subProfile: Subscription = new Subscription;
  mode: string | undefined;
  @Output() editmode = new Subject<string>();
  index: string | undefined;
  userposts: string | undefined;
  creator: string | undefined;
  listOn = false;
  findComment: Comment[] = [];
  format: string | undefined;
  isMobile!: number;
  postCreator!: string;
  postLikes: string[] = [];
  postDislikes: string[] = [];
  likesCount: number = 0;
  dislikesCount: number = 0;
  likes: Like[] = [];
  usernameError!: boolean;
  postSelected: Boolean = false;
  postSelectedId!: string;
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  columnsToDisplay: string[] = ['imagePath', 'username', 'location', 'title'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Profile | null | undefined;
  type: any = ['Forums', 'Ad'];
  forums: any = ['vent', 'events', 'discussions'];
  ads: any = ['women for men', 'men for women', 'women for women', 'men for men']

  constructor(public mpService: MessagePostService,
              public profileService: ProfileService,
              private authService: AuthService,
              private router: Router,
              private commentService: CommentsService,
              private likeService: LikeService
              ) {
                this.dataSource = new MatTableDataSource([...this.posts]);
    }
  ngOnInit() {
    this.userId = sessionStorage.getItem('userId') as string;
      this.isMobile = window.innerWidth;
      console.log('isMobile', this.isMobile, 'userId', this.userId);
    this.creator = localStorage.getItem('creator') as string;
    this.username = sessionStorage.getItem('username') as string;
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.
    getAuthStatusListener().
    subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
      console.log('userId', this.userId)
     });
    this.mode = '';
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.mpService.getMessagePosts();
    this.postsSub = this.mpService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[] }) => {
            this.dataSource.data = postData.posts;
            this.posts = postData.posts;
            this.isLoading = false;
            this.dataSource.paginator = this.paginator!;
            this.dataSource.sort = this.sort!;
            this.filterLikes(postData.posts);
            this.filterDislikes(postData.posts);
        });
    this.subProfile = this.profileService.getProfileUpdateListener()
    .subscribe((profileData: {profiles: Profile[]}) => {
      this.isLoading = false;
      this.profiles = profileData.profiles;     
   });
  }
  ngAfterVieInit() {
    this.dataSource.paginator = this.paginator!;
  }
  
  filterDislikes(posts: Post[]) {
    posts.filter(post =>  {
        post.dislikes?.filter(dislikeUser => {
          if(dislikeUser == this.username) {
            this.postDislikes?.push(post.id);
          }
        });
      }
      )
  }
  filterLikes(posts: Post[]) {
      posts.filter(post =>  {
            post.likes?.filter(likeUser => {
              if(likeUser == this.username) {
                this.postLikes?.push(post.id);
              }
            } )
          })
  }
  addLikes(id: any, username: string) {
      this.postSelected = true;
      this.postSelectedId = id;
      if(this.postLikes.indexOf(id) > -1) {
          this.dataSource.data.map((element: Post) => {
            this.dataSource.data.find((y: Post) => {
              if(y.id == this.postSelectedId) {
                element.likes = element.likes?.filter(name => name != this.username)
                this.postLikes = this.postLikes.filter(user => user != id)
              }
              element.likesAmt!-- ;
              return {...element}
            })
          })
          this.mpService.unliked(id, this.username!); 
          this.postLikes = this.postLikes.filter(element => element != id)
        } else {
          this.dataSource.data.map(element => {
            this.dataSource.data.find((y: Post) => {
              if(y.id == this.postSelectedId) {
                element.likes!.push(this.username!);
                this.postLikes.push(id); 
              }
              element.likesAmt!++;
              return {...element}
            })
          })
          this.mpService.liked(id, this.username!) 
          this.postLikes?.push(id!);    
        } 
  }
  addDislikes(id: any, username: string) {
    this.postSelected = true;
    this.postSelectedId = id;
    if(this.postDislikes.indexOf(id) > -1) {
      this.dataSource.data.map((element: Post) => {
        this.dataSource.data.find((y: Post) => {
          if(y.id == this.postSelectedId) {
            element.dislikes?.filter(name => name != this.username)
            this.postDislikes = this.postDislikes.filter(user => user != id)
          }
          element.dislikesAmt!--;
          return {...element}
        })
      })
      this.mpService.unDisliked(id, this.username!);
      this.postDislikes = this.postDislikes.filter(element => element != id)
    } else {
      this.dataSource.data.map(element => {
        this.dataSource.data.find((y: Post) => {
          if(y.id == this.postSelectedId) {
            element.dislikes!.push(this.username!)
            this.postDislikes.push(id);
          }
          element.dislikesAmt!++;
          return {...element}
        })
      })
      this.mpService.disliked(id, this.username!)
      this.postDislikes?.push(id!);
    }
    // this.filterDislikes(this.dataSource.data);    
  }
  sortData(event: any) {
    this.dataSource.data = this.posts;
    if(event == 'All') {
      console.log('in if', this.dataSource.data)
      this.dataSource = new MatTableDataSource(this.posts)
      this.dataSource.paginator = this.paginator!;
      this.dataSource.sort = this.sort!;
    } else {
      const posts = this.dataSource.data.filter(post => post.section == event);
      this.dataSource = new MatTableDataSource(posts);
      this.dataSource.paginator = this.paginator!;
      this.dataSource.sort = this.sort!;
    }
  }
  setDefaultPic() {
    this.userPic = '../../../assets/images/default_pic.jpg';
  }
  setPostChoice(postChoice: string) {
    this.selectedChoice = postChoice;
    // this.posts = this.posts.filter(post => post.postChoice === postChoice);
  }
  choosePostSection(postSection: String) {
    // this.posts = this.posts.filter(post => post.postSection === postSection);
  }

 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  findUser(username: string) {
    this.userPosition = this.profiles.findIndex(profile => profile.username === username);
    this.router.navigate(['/home/' + this.userPosition ]);
  }
  badgeNumber(postEl: string) {
    const badge = this.comments.filter(comment => comment.commentor === postEl);
    this.commentsLength = badge.length;
  }
  getCommentLength() {
    this.commentsLength = this.myComment.length;
  }
onDelete(postId: string) {
  this.isLoading = true;
  this.mpService.deletePost(postId)
  .subscribe(() => {
      this.mpService.getMessagePosts();
    }, () => {
      this.mpService.mpChanged.next({
        posts: [...this.posts]
      });
      this.isLoading = false;
    });
  }
  OnEdit(postId: string) {
  }

  getComments() {
    this.listOn = true;
  }
  closeComments() {
    this.listOn = false;
  }
  
  onComment(id: string, postUsername: string) {
    const username = sessionStorage.getItem('username') as string;
    if(username === postUsername) {
     return this.usernameError = true;
    }
    else {
      this.modeSub = this.mpService.getModeUpdateListener()
      .subscribe((modeData: string ) => {
        this.isLoading = true;
        this.mode = modeData;
      });
      this.mpService.commentMode();
      const postId = id;
      sessionStorage.setItem('postId', postId);
      return this.usernameError = false;
    }
    
  }
  onCloseComment() {
    this.mode = 'null';
  }
  ngOnDestroy(): void {
     this.authStatusSub.unsubscribe();
     this.postsSub.unsubscribe();
     this.userPostsStatus.unsubscribe();
   }
}
export class ExampleDataSource extends DataSource<any> {

  private _data$: BehaviorSubject<[]> = new BehaviorSubject([]) ;
  data$ = this._data$.asObservable();

  update(data: any) {
    const rows: any = [];
    data.forEach((element: any) => rows.push(element, { detailRow: true, element }));
    this._data$.next(rows);
  }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    return this.data$;
  }

  disconnect() { }
}

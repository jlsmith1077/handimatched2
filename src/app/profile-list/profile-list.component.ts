import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, switchMap, tap } from 'rxjs';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Profile } from '../profile.model';
import { Post } from '../messageboard/message-post.model';
import { MessagePostService } from '../messageboard/message-post.service';
import { ProfileService } from '../profile.service';
import { AuthService } from '../authentication/auth.service';
import { CustomPaginator } from './customPagination';
import { MatTableDataSource } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort } from '@angular/material/sort';

interface sortList {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.css'],
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

export class ProfileListComponent implements OnInit, OnDestroy {
  profiles: Profile[] = [];
  userPic: string | undefined;
  displayUsername: any;
  index!: number;
  displayLocation: any;
  displayImage: any;
  displayGender: any;
  isMobile: number;
  removeDivider: boolean = false;
  removeDividerSub: Subscription = new Subscription;
  posts: Post[] = [];
  selectedSort: string | undefined;
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string | undefined;
  isLoading = false;
  private subProfile: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;
  dataSource!: MatTableDataSource<any>;

  columnsToDisplay: string[] = ['imagePath', 'username', 'location', 'gender'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Profile | null | undefined;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

    constructor(private profileService: ProfileService,
                private postsService: MessagePostService,
                private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                ) { 
                    this.isMobile = window.innerWidth;
                  }
     ngOnInit(): void {
      this.subProfile = this.profileService.getProfileUpdateListener()
       .subscribe((profileData: {profiles: Profile[]}) => {
        this.isLoading = false;
        this.profiles = profileData.profiles
        this.dataSource = new MatTableDataSource(this.profiles)
        this.dataSource.paginator = this.paginator!;
        this.dataSource.sort = this.sort!;
       });
       this.selectedSort = localStorage.getItem('selectedSort') as string;
       this.isLoading = true;
       this.userIsAuthenticated = this.authService.getIsAuth();
       this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
        this.profileService.getProfiles();
        console.log('profile cmnt', this.profiles )
  }

  ngAfterVieInit() {
    this.dataSource.paginator = this.paginator!;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  setDefaultPic() {
    this.userPic = '../../../assets/images/default_pic.jpg';
    console.log('user pic', this.userPic);
  }
    
  // initialLoad(){
  //   this.subProfile = this.profileService.getProfileUpdateListener()
  //      .subscribe((profileData: {profiles: Profile[]}) => {
  //      this.isLoading = false;
  //      this.totalPosts =  2;
  //      this.profiles = profileData.profiles;
  //      this.currentPage = this.currentPage;
  //     this.postsPerPage = this.postsPerPage;
  //      });
  // }
 
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    console.log('on change event', this.currentPage, this.postsPerPage);
  }
  
  sorting(selectedSort: string) {
    sessionStorage.setItem('selectedSort', selectedSort);
    this.profileService.getProfiles();
  }   

  onNewProfile() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subProfile.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.removeDividerSub.unsubscribe
  }
}

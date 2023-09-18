import { Component, OnInit, OnDestroy, ViewChild, Input, ChangeDetectorRef, NgModule } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription, switchMap, tap } from 'rxjs';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Profile } from '../profile.model';
import { Post } from '../messageboard/message-post.model';
import { MessagePostService } from '../messageboard/message-post.service';
import { ProfileService } from '../profile.service';
import { AuthService } from '../authentication/auth.service';
import { CustomPaginator } from './customPagination';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { SlideInterface } from '../slider_interface';
import { ImageGallery } from '../image_gallery.model';
import { VideoGallery } from '../video_gallery.model';

interface sortList {
  value: string;
  viewValue: string;
}
interface mediaArray {
  id: string;
  path: string,
  title: string,
  likes: string[],
  likesAmt: number
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
  openSendMessage: Boolean = false;
  matTableInitialState: Boolean = true;
  likesAmt?: number;
  username!: string;
  userId!: string;
  creator!: string;
  likesCount: number = 0;
  dislikesCount: number = 0;
  mediaSelectedId!: string;
  mediaLikes: string[] = [];
  mediaDislikes: string[] = [];
  imageToShow: string = '';
  imageArray: mediaArray [] = [];
  videoArray: mediaArray [] = [];
  show: number = 1;
  showVideo: number = 1;
  start: number = 0;
  startVideo: number = 0;
  elementId: string = '';
  disableNext: boolean = false;
  disableNextVideo: boolean = false;
  disablePrev: boolean = true;
  disablePrevVideo: boolean = true;
  openImageGallery: Boolean = false;
  openVideoGallery: Boolean = false;
  slides: SlideInterface[] = [];
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
  userIsAuthenticated = false;
  isLoading = false;
  private subProfile: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;
  dataSource!: MatTableDataSource<any>;

  columnsToDisplay: string[] = ['imagePath', 'username', 'location', 'gender'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: Profile | null | undefined;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatTable) table?:  MatTable<any>
  receivername = '';

    constructor(private profileService: ProfileService,
                private postsService: MessagePostService,
                private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                private cd: ChangeDetectorRef
                ) { 
                    this.isMobile = window.innerWidth;
                    this.dataSource = new MatTableDataSource([...this.profiles])
                  }
     ngOnInit(): void {
      this.username = sessionStorage.getItem('username') as string;
      this.creator = sessionStorage.getItem('profile_id') as string;
      this.subProfile = this.profileService.getProfileUpdateListener()
       .subscribe((profileData: {profiles: Profile[]}) => {
          this.isLoading = false;          
          this.dataSource.data = profileData.profiles;
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
        this.cd.detectChanges()
  }
  groupsitesso(){
    this.profileService.groupsiteSSOConnect();
  }

  sendMessage(receivername: string) {
    this.receivername = receivername;
    console.log('receivername', receivername)
    if(!this.openSendMessage) {
      this.openSendMessage = true;
    } else {
      this.openSendMessage = false
    }
  }
  filterLikes(profiles: Profile[]) {
    profiles.filter(profile =>  {
          profile.imageGallery?.filter(image => {
            image?.likes?.filter(likeUser => {
              if(likeUser == this.username) {
                this.mediaLikes.push(this.username)
              }
            })
          })
        })
  }
  addVideoLikes(profileId: string, mediaId: string ) {
    const profileIndex = this.dataSource.data.findIndex((profile: Profile) => profile.id == profileId);
    let newProfiles = [...this.dataSource.data];
    const videoIndex = newProfiles[profileIndex].videoGallery.findIndex((video: VideoGallery ) => video._id == mediaId);
    const likes = newProfiles[profileIndex].videoGallery[videoIndex].likes;
    const likesremove = likes.filter((name: string) => name == this.username);
    const likesAmtMinus = newProfiles[profileIndex].videoGallery[videoIndex].likesAmt--;
    const likesAmtAdd = newProfiles[profileIndex].videoGallery[videoIndex].likesAmt++;
      if(likes.indexOf(this.username) > -1) {
          this.dataSource.data.find((y: Profile) => {
            if(y.id == profileId) {
              for (let video of y.videoGallery) {
                if(video._id == mediaId) {
                  const changedVideo = video.likes!.filter(username => username != this.username);
                  const changedDataVideo = video.likes?.filter(username => username != this.username);
                  this.videoArray[videoIndex].likesAmt--
                  this.videoArray[videoIndex].likes = changedVideo   
                  video.likes = changedDataVideo;                                
                  video.likesAmt!--;
                  }
              }
            }
          })
        this.profileService.unlikedVideo(profileId, this.username!, mediaId)
      } else {
         this.dataSource.data.find((y: Profile) => {
            if(y.id == profileId) {
              for (let video of y.videoGallery) {
                if(video._id == mediaId) {
                  video.likes!.push(this.username);
                  this.videoArray[videoIndex].likesAmt++
                  this.videoArray[videoIndex].likes.push(this.username)
                }
                video.likesAmt!++
              }
            }
          })
        this.profileService.likedVideo(profileId, this.username!, mediaId)  
      } 
}
addLikes(profileId: string, mediaId: string ) {
    const profileIndex = this.dataSource.data.findIndex((profile: Profile) => profile.id == profileId);
    let newProfiles = [...this.dataSource.data];
    const imageIndex = newProfiles[profileIndex].imageGallery.findIndex((image: ImageGallery ) => image._id == mediaId);
    const likes = newProfiles[profileIndex].imageGallery[imageIndex].likes;
    const likesremove = likes.filter((name: string) => name == this.username);
    const likesAmtMinus = newProfiles[profileIndex].imageGallery[imageIndex].likesAmt--;
    const likesAmtAdd = newProfiles[profileIndex].imageGallery[imageIndex].likesAmt++;
      if(likes.indexOf(this.username) > -1) {
          this.dataSource.data.find((y: Profile) => {
            if(y.id == profileId) {
              for (let image of y.imageGallery) {
                if(image._id == mediaId) {
                  const changedImage = image.likes!.filter(username => username != this.username);
                  const changedDataImage = image.likes?.filter(username => username != this.username);
                  this.imageArray[imageIndex].likesAmt--
                  this.imageArray[imageIndex].likes = changedImage   
                  image.likes = changedImage;               
                  console.log('changed image', changedImage)                  
                  image.likesAmt!--;
                  }
              }
              console.log('image gallery', y)
            }
          })
        this.profileService.unliked(profileId, this.username!, mediaId)
      } else {
          console.log('how many loops throuhg')
         this.dataSource.data.find((y: Profile) => {
            console.log('how many loops throuhg2')
            if(y.id == profileId) {
              console.log('how many loops throuhg3')
              for (let image of y.imageGallery) {
                if(image._id == mediaId) {
                  console.log('username', this.username);
                  image.likes!.push(this.username);
                  this.imageArray[imageIndex].likesAmt++
                  this.imageArray[imageIndex].likes.push(this.username)
                }
                image.likesAmt!++
              }
            }
          })
        this.profileService.liked(profileId, this.username!, mediaId)  
      }    
}

doMediaUpdate = (currentMedia: Profile[]) => {
  
}

addDislikes(id: any, username: string) {
  this.mediaSelectedId = id;
  const mediaId = id;
  if(this.mediaDislikes.indexOf(id) > -1) {
    this.dataSource.data.map((element: Post) => {
      this.dataSource.data.find((y: Post) => {
        if(y.id == this.mediaSelectedId) {
          element.dislikes?.filter(name => name != this.username)
          this.mediaDislikes = this.mediaDislikes.filter(user => user != id)
        }
        element.dislikesAmt!--;
        return {...element}
      })
    })
    this.profileService.unDisliked(id, this.username!, mediaId);
    this.mediaDislikes = this.mediaDislikes.filter(element => element != id)
  } else {
    this.dataSource.data.map(element => {
      this.dataSource.data.find((y: Post) => {
        if(y.id == this.mediaSelectedId) {
          element.dislikes!.push(this.username!)
          this.mediaDislikes.push(id);
        }
        element.dislikesAmt!++;
        return {...element}
      })
    })
    this.profileService.disliked(id, this.username!, mediaId)
    this.mediaDislikes?.push(id!);
  }
  // this.filterDislikes(this.dataSource.data);    
}
  emptyImageArray(imageGallery: SlideInterface[], videoGallery: SlideInterface[]) {
    this.imageArray = [];
    this.videoArray = [];
    this.show =  1;
    this.start = 0;
    imageGallery.map(image => {
      this.imageArray.push({id: image._id, path: image.path, title: image.title, likes: image.likes, likesAmt: image.likesAmt})
    });
    videoGallery.map(video => {
      this.videoArray.push({id: video._id, path: video.path, title: video.title, likes: video.likes, likesAmt: video.likesAmt})
    });
  }
  ngAfterVieInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.data = this.profiles
  }
  prev(){
    if(this.start == 0) {
      return
    } else {
      this.show--;
      this.start--;
      this.disableNext = false;
      if(this.start == 0) {
        this.disablePrev = false;
      }
    }
} 
next(){
    if(this.show == this.imageArray.length) {
      return
    } else {
      this.show++;
      this.start++;
      this.disablePrev = true;
      if(this.show == this.videoArray.length) {
        this.disableNextVideo = true;
      }
    }
}
prevVideo(){
  if(this.startVideo == 0) {
    return
  } else {
    this.showVideo--;
    this.startVideo--;
    this.disableNextVideo = false;
    if(this.startVideo == 0) {
      this.disablePrevVideo = false;
    }
  }
} 
nextVideo(){
    if(this.showVideo == this.videoArray.length) {
      return
    } else {
      this.showVideo++;
      this.startVideo++;
      this.disablePrevVideo = true;
      if(this.showVideo == this.videoArray.length) {
        this.disableNextVideo = true;
      }
    }
}
  openCloseImageGallery() {
    if(this.openImageGallery){
      this.openImageGallery = false;
    } else {
      this.openImageGallery = true;
    }
  }
  openCloseVideoGallery() {
    if(this.openVideoGallery){
      this.openVideoGallery = false;
    } else {
      this.openVideoGallery = true;
    }
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
    this.removeDividerSub.unsubscribe();
  }
}

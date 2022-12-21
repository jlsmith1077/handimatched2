import { Component, OnInit, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';

import { Profile } from '../../profile.model';
import { ProfileService } from '../../profile.service';
import { FormGroup } from '@angular/forms';
import { Video } from './videos-folder/video.model';
import { VideoService } from './videos-folder/video.service';
import { LikeService } from 'src/app/like/like.service';
import { Like } from './../../like/like.model';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.css']
})
export class ProfileDetailComponent implements OnInit, OnDestroy {
  profile: any = Profile;
  profiles: Profile[] = [];
  video: any = Video;
  videos: Video[] = [];
  id: number | undefined;
  Id: string | undefined;
  profileId: number | undefined;
  users = '';
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  selectedSort: string = '';
  @Output() profileForm: FormGroup | undefined;
  public mode = 'login';
  public mediamode = 'login';
  @Output() editmode = new Subject<string>();
  private subProfile: Subscription = new Subscription;
  private modeSub: Subscription = new Subscription;
  private subVideo: Subscription = new Subscription;
  private subLike: Subscription = new Subscription;
  email: string | undefined;
  profileUsername: string | undefined;
  username: string | undefined;
  loginUsername: string | undefined;
  likesCount: number = 0;
  dislikesCount: number = 0;
  component: string | undefined;
  likes: Like[] = [];
  like: any = Like;

  constructor(private profileService: ProfileService,
              private videoService: VideoService,
              private likeService: LikeService,
              private route: ActivatedRoute,
              private router: Router) {
              }

  ngOnInit(): void {
    this.selectedSort = localStorage.getItem('selectedSort') as string;
    this.loginUsername = localStorage.getItem('username') as string;
    this.email = localStorage.getItem('email') as string;
    this.route.params
    .subscribe(
    (params: Params) => {
      this.id = +params['id'];
      console.log('id in detail', this.id);
      if(!this.id){
        this.id = JSON.parse(sessionStorage.getItem('index') as string) ;
      }
      this.profile = this.profileService.getProfile(this.id!);
      console.log('profile b4 if statement', this.profile);
      if(!this.profile) {
        this.subProfile = this.profileService.getProfileUpdateListener()
       .subscribe((profileData: {profiles: Profile[]}) => {
       this.profiles = profileData.profiles;
       this.profile = this.profileService.getProfile(this.id!);
       console.log('profile', this.profile);
       const receivername = this.profile.username;
      console.log('username', this.profile.username);
      this.profileUsername = receivername;
      sessionStorage.setItem('profileusername', this.profileUsername!);
      sessionStorage.setItem('receivername', receivername);
      this.username = this.profile.username;
      this.videoService.getVideos();
       });
        } else {
          const receivername = this.profile.username;
          console.log('username', this.profile.username);
          this.profileUsername = receivername;
          sessionStorage.setItem('profileusername', this.profileUsername!);
          sessionStorage.setItem('receivername', receivername);
          this.username = this.profile.username;
          this.videoService.getVideos();
        }
      
      }
    );
    this.videoService.getVideoUpdateListener();
    this.subVideo = this.videoService.getVideoUpdateListener()
    .subscribe((videoData: {videos: Video[]}) => {
    this.isLoading = false;
    this.videos = videoData.videos;
    const VideoLength = this.videos.filter(video => video.username === this.username);
    if(VideoLength.length >-1) {
      this.videos = VideoLength;
      this.mediamode = 'videos';
    } 
    });
  }
  addFriend() { 
    const id = sessionStorage.getItem('userId');
    console.log('id in detail.ts', id);
    this.profileService.Addfreind(id, this.username);
  }
  onSaveData() {
  }
  onEditProfile() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }
  onDelete(profileId: string) {
    this.profileService.deleteProfile(profileId).subscribe(() => {
      this.profileService.getProfiles();
    });
  }
  sendMessage() {
    this.mode = 'create';
  }
  checkMediaMode() {
    for(let videoEl of this.videos) {
      if(videoEl.username === this.username){
      }
    } this.mediamode = 'videos';
    console.log('videos', this.mediamode);
  }

  viewVideos() {
    this.mediamode = 'videos';
    this.profileUsername = sessionStorage.getItem('receivername') as string;
  }
  viewPictures() {
    this.mode = 'pictures';
  }
  videoChat() {
    this.mode = 'videoChat';
  }
  
  onCancel() {
    this.mode = 'login'
    //this.router.navigate(['/']);
  }
  ngOnDestroy() {
    sessionStorage.removeItem('receivername');
    this.profileUsername = '';
    this.mediamode = 'login';
  }
}


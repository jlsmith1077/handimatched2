import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ProfileService } from '../../profile.service';
import { AuthService } from 'src/app/authentication/auth.service';
import { Profile } from '../profile.model';
import { Subscription, Subject } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})

export class MyProfileComponent implements OnInit, OnDestroy {
  showAddPicButton: Boolean = false;
  imagePreview: string | undefined;
  imageForm!: FormGroup;
  myWeather: any;
  weatherData: any;
  postsPerPage = null;
  totalPosts = null;
  currentPage = null;
  profiles: Profile[] = [];
  user: any;
  userName: string | undefined;
  userLocation: string | undefined;
  @Input() profile: Profile | undefined;
  @Input() index: number | undefined;
  isLoading = false;
  private authProfile: Subscription = new Subscription;
  private imageUpdated: Subscription = new Subscription;
  private subProfile: Subscription = new Subscription;
  private postsSub: Subscription = new Subscription;
  email: string | undefined;
  userPic: string = '../../../assets/images/default_pic.jpg'
  userId: string | undefined;
  @Input() userPosts = new Subject<boolean>();
  


  constructor(private profileService: ProfileService, private authService: AuthService) {}

  ngOnInit() {
    this.imageForm = new FormGroup({
     'imagePath': new FormControl(null, {
       validators: [Validators.required]
     })
    });
        this.subProfile = this.profileService.getProfileEditListener().subscribe((profile) => {
          console.log('in subProfile my profile cmpnt');
        this.user = profile;
        if(profile.imagePath) {
          this.userPic = profile.imagePath;
          console.log('this user pic', this.userPic)
          sessionStorage.setItem('userPic', this.user.imagePath);
        }
            sessionStorage.setItem('location', profile.location);
            sessionStorage.setItem('username', profile.username);
       })
       this.email = localStorage.getItem('email') as string;
       this.userPosts.next(true);
       this.isLoading = true;
       this.imageUpdated = this.profileService.getPictureUpdateListener().
       subscribe(imagePath => {
        this.userPic = imagePath
        console.log('user in picture update', this.userPic
        )
       });
      //  this.user = JSON.parse(sessionStorage.getItem('user'));
      this.authProfile = this.authService.getUserStatusListener().subscribe(profileData => {
        console.log('in authPRofile my profile cmpnt');
          if(this.user) {
            return
          } else {
            this.user = profileData.profile;
            if(!profileData.profile || !profileData.profile && !this.userPic) {
                this.userLocation = 'Please Update your Profile';
                this.userName = 'John Doe';               
              } else {
                this.userName = profileData.profile.username;
                localStorage.setItem('username', this.userName!);
                localStorage.setItem('location', profileData.profile.location);
                this.userLocation = profileData.profile.location;
                this.userPic = profileData.profile.imagePath;
                  if(this.userPic != profileData.profile.imagePath) {
                    this.userPic = this.user.imagePath
                  } else {
                    sessionStorage.setItem('location', profileData.profile.location);
                    sessionStorage.setItem('userPic', this.user.imagePath);
                    sessionStorage.setItem('username', profileData.profile.username);
                    sessionStorage.setItem('profileId', this.user.id);
                  }
              }
          }
        });
}
changeProfilePic() {
  const imagePath = this.imageForm.value.imagePath
  this.profileService.changeProfilePic(imagePath);
  this.showAddPicButton = false;
  this.imagePreview = '';
}
onImagePicked(event: Event) {
  const file = (event.target as HTMLInputElement).files![0];
  this.imageForm.patchValue({imagePath: file});
  this.imageForm.get('imagePath')!.updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () => {
  this.imagePreview = reader.result as string;
};
reader.readAsDataURL(file);
this.showAddPicButton = true;
  }
setDefaultPic() {
  this.userPic = '../../../assets/images/default_pic.jpg';
  this.userLocation = 'Please Update your Profile';
}

getUserPostUpdatelistener() {
  return this.userPosts.asObservable();
}
getWeather() {
  this.profileService.getWeather(this.userLocation!);
      this.profileService.getWeatherUpdateListener().
       subscribe((data) => {
          this.weatherData = data;
          this.myWeather = this.weatherData.forecastData
       });
}
ngOnDestroy() {
  this.imageUpdated.unsubscribe();
  this.subProfile.unsubscribe();
  this.authProfile.unsubscribe();
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('creator');
  sessionStorage.removeItem('userId');
}
addElement() {
  let newDiv = document.createElement('mat-card-footer');
  let newContent = document.createTextNode(this.myWeather);
  console.log(this.myWeather);
  newDiv.appendChild(newContent);
  }
}
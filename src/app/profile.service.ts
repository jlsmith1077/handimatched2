import { Injectable } from '@angular/core';
import { Profile } from './profile.model';
import { Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './authentication/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from './../environments/environment';
import { User } from './authentication/user.model';

const backendURL = environment.apiURL + "/profile/" ;
const backendURL3 = environment.apiURL + "/friend/";
const backendURL2 = environment.apiURL + "/weather?address=";
const default_pic = '../'
@Injectable({
  providedIn: 'root'
})
export class ProfileService {  
  pictureUpdated = new Subject<string>();
  routerStatusListener = new Subject<boolean>();
  profilesChanged = new Subject<Profile[]>();
  profileEditUpdate = new Subject<Profile>();
  profilesUpdated = new Subject<{ profiles: Profile[]}>();
  weatherUpdate = new Subject<{forecast: any}>();
  currentPage: number = 1;
  postsperpage: number = 0;
  private profiles: Profile[] = [];
  loadedProfiles: Profile[] = [];
  updatedProfile = '';
  oldProfileIndex = '';
  id: number = 0;
  Id: string= '';
  profileId: number = 0;
  mode = 'login';
  address = sessionStorage.getItem('location') as string;
  selectedSort: string = '';
  private subProfile: Subscription = new Subscription
  private subscription: Subscription = new Subscription

  constructor(private http: HttpClient, private router: Router, private Auth: AuthService) {
    
   }
  getPictureUpdateListener(){
    return this.pictureUpdated.asObservable();
  }
  getRouterStatusListener(){
    return this.routerStatusListener.asObservable();
  }
  getProfiles() {
      // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}&sort=${selectedSort}`;
      // const profilesperpage = JSON.stringify(postsPerPage);
      // const currentpage2 = JSON.stringify(currentPage);
      const default_pic = '../assets/images/default_pic.jpg'
    //   sessionStorage.setItem('profilesperpage', profilesperpage);
    //   sessionStorage.setItem('currentpage2', currentpage2);
    //   this.selectedSort = sessionStorage.getItem('selectedSort')!;
    //   if (this.selectedSort === null) {
    //       this.selectedSort = 'username';
    // }
    this.http.get<{
      message: string;
      profiles: any
    }>( backendURL)
      .pipe(
        map((profileData) => {
          return {
            profiles: profileData.profiles.map((profile: { _id: string; fullname: string; imagePath: string; email: string; location: string; username: string; gender: string; interest: string; creator: string; friends: []; friendsAmt: number; }) => {
              if(!profile.imagePath) {
                return {
                  id: profile._id,
                  fullname: profile.fullname, 
                  imagePath: default_pic,
                  email: profile.email,
                  location: profile.location,
                  username: profile.username,
                  gender: profile.gender,
                  interest: profile.interest,
                  creator: profile.creator,
                  friends: profile.friends,
                  friendsAmt: profile.friendsAmt
                }
              } else {
              return {
                id: profile._id,
                fullname: profile.fullname, 
                imagePath: profile.imagePath,
                email: profile.email,
                location: profile.location,
                username: profile.username,
                gender: profile.gender,
                interest: profile.interest,
                creator: profile.creator,
                friends: profile.friends,
                friendsAmt: profile.friendsAmt
              } };
            }),
          };
        })
      )
      .subscribe(transformedprofileData => {
        const email = localStorage.getItem('email') as string;
        this.profiles.push(transformedprofileData.profiles);
        this.profiles = transformedprofileData.profiles;
        this.profilesUpdated.next({
          profiles: [...this.profiles]
        });
      });
  }
  changeProfilePic(imagePath: File) {
    let profileData: FormData;
    profileData = new FormData();
    profileData.append('imagePath', imagePath, 'updated pic')
    this.http.patch<{message: string, imagePath: any}>(
      backendURL, profileData
    ).subscribe( returnData => {
      this.getProfiles();
      this.pictureUpdated.next(returnData.imagePath);
    });
  }
  getProfileEdit(id: string) {
    this.http.get<{message: string, profile: Profile}>(
      backendURL+ id)
      .subscribe( returnData => {
      this.profileEditUpdate.next(returnData.profile);
    });
  }

  Addfreind(id: any, username: any) {
    const  profilesPerPage = JSON.parse(sessionStorage.getItem('profilesperpage')!);
    const currentPage = JSON.parse(sessionStorage.getItem('currentpage2')!);
    const selectedSort = JSON.parse(sessionStorage.getItem('selectedSort')!);
    const friendData = {id, username};
    return this.http.put<{message: string}>(backendURL3, friendData).subscribe(res => {
      this.getProfiles();
    });
  }
  grabProfiles() {
    return {...this.profiles};
  }
  setProfiles(profiles: Profile[]) {
    this.profiles = profiles;
    this.profilesChanged.next(this.profiles.slice());
  }
  getProfilebyEmail(email: string) {
    return {...this.profiles.find(profile => profile.email === email)};
    }
  getProfilebyUsername(username: string) {
    return {...this.profiles.find(profile => profile.username === username)};
    }
  getProfilebyCreator(creator: string) {
    return {...this.profiles.find(profile => profile.creator === creator)};
    }

  getProfile(index: number) {
    return this.profiles[index];

  }
  getProfileCreator(creator: any) {
    return this.profiles[creator];
  }
  getProfile2(id: string | undefined) {
    return {...this.profiles.find(p => p.id === id)};
  }

  getProfile3(id: string) {
    return this.http.get<{_id: string, username: string,
                email: string, imagePath: string,
                location: string, interest: string,
                gender: string, fullname: string, creator: string}>(backendURL + id);
  }
  deleteProfile(profileId: string) {
   return this.http.delete(backendURL + profileId);
  }

  googleProfile() {
    const storage = localStorage.getItem('google_auth');
    let userDetails: any;
    userDetails = JSON.parse(storage!);
    if(storage) {   
      this.http.put<{ message: string}>(
        backendURL + '/social', userDetails
        )
        .subscribe(res => {
        const message = res.message;
        this.getProfiles();
      });
    }
  }

  addProfile(username: string, location: string,
             fullname: string, email: string, gender: string,
             interest: string, imagePath: string | File) {
    const profileData = new FormData();
    profileData.append('username', username);
    profileData.append('location', location);
    profileData.append('fullname', fullname);
    profileData.append('email', email);
    profileData.append('gender', gender);
    profileData.append('interest', interest);
    profileData.append('image', imagePath);
    this.http.
      post<{ message: string;
             profile: any }>
      (
        backendURL, profileData
      )
      .subscribe(response => {
        this.getProfiles();
        const email = localStorage.getItem('email');
        const user = this.getProfilebyEmail(email!);
        const username = sessionStorage.setItem('username', response.profile._doc.username);
        const userPic = sessionStorage.setItem('userPic', response.profile._doc.imagePath);
        const profile = response.profile._doc;
        this.Auth.user.next(profile);
        this.router.navigate(['/']);

      });
  }

  storeProfiles(profiles: Profile[]) {
    this.profiles = profiles;
    this.profilesChanged.next(this.profiles.slice());
  }
  profileUpdate(index: number, newProfile: Profile) {
    this.profiles[index] = newProfile;
  }

  updateProfile(id: string,
                username: string,
                email: string,
                image: File | string,
                location: string,
                interest: string,
                gender: string,
                fullname: string,
                creator: string,
                friends: [],
                friendsAmt: number) {
let profileData: Profile | FormData;
this.mode = 'edit';
if (typeof image === 'object') {
  profileData = new FormData();
  profileData.append('id', id);
  profileData.append('username', username);
  profileData.append('email', email);
  profileData.append('image', image, username);
  profileData.append('location', location);
  profileData.append('interest', interest);
  profileData.append('gender', gender);
  profileData.append('fullname', fullname);
  profileData.append('creator', creator);
  profileData.append('friends', JSON.stringify(friends));
  profileData.append('friendsAmt', JSON.stringify(0));
} else {
  profileData = {
    id: id, username: username, email: email, imagePath: image, location: location, interest: interest, gender: gender, fullname: fullname, creator: creator, friends, friendsAmt 
  };
}
this.http.put<{message: string, profile: Profile}>(backendURL + id, profileData)
.subscribe(returnData => {
    const id = sessionStorage.getItem('userId') as string;
    // this.loadedProfiles = profiles;
    // this.getProfileEdit(id)!;
    this.profilesUpdated.next({
      profiles: [...this.profiles]
    });
    this.profileEditUpdate.next(returnData.profile);
    this.router.navigate(['/']);
    });
}

  getProfileUpdateListener() {
    return this.profilesUpdated.asObservable();
  }
  getProfileEditListener() {
    return this.profileEditUpdate.asObservable();
  }
  updateProfile2(index: number, newProfile: Profile) {
    this.profiles[index] = newProfile;
    this.profilesChanged.next(this.profiles.slice());
  }

  getWeatherUpdateListener() {
    return this.weatherUpdate.asObservable();
  }
  getWeather(address: string) {
    console.log('address from getWeather in service.ts', address);
    fetch( backendURL2 + address)
        .then((response) => {
          response.json().then((data) => {
            if (data.error) {
              console.log(data.error);
            } else {
              this.weatherUpdate.next(data);
              console.log('made it through whole get weather function');
            }
          });
        });
}

  onDestroy() {
    
  }
}

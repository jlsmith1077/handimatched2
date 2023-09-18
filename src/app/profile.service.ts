import { Injectable } from '@angular/core';
import { Profile } from './profile.model';
import { Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './authentication/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { environment } from './../environments/environment';
import { ImageGallery } from './image_gallery.model';
import { VideoGallery } from './video_gallery.model';
import { SlideInterface } from './slider_interface';
import { Like } from './like/like.model';
import { Dislike } from './like/dislike.model';

const backendURL = environment.apiURL + "/profile/" ;
const backendURL1 = environment.apiURL + "/test/" ;
const backendURL3 = environment.apiURL + "/friend/";
const backendURLPics = environment.apiURL + "/media/";
const backendURLVideos = environment.apiURL + "/video/";
const backendURLLike = environment.apiURL + "/like/";
const backendURLImageLike = environment.apiURL + "/imagelikes/";
const backendURLVideoLike = environment.apiURL + "/videolikes/";
const backendURLDislike = environment.apiURL + "/dislike/";
const backendURLProfilePic = environment.apiURL + "/profilepic/";
const backendURL2 = environment.apiURL + "/weather?address=";
const xml = "./tobase64.xml";
@Injectable({
  providedIn: 'root'
})
export class ProfileService { 
  slides: SlideInterface[] = []; 
  imageGalleryUpdate = new Subject<SlideInterface[]>();
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
  userPic: string = '';
  parser = new DOMParser()
  samltobase64 = 'Cgo8QXR0cmlidXRlIE5hbWU9InVpZCIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOm5hbWVpZC1mb3JtYXQ6dHJhbnNpZW50IiBGcmllbmRseU5hbWU9Imdyb3VwcyI+CiAgPEF0dHJpYnV0ZVZhbHVlPjEyMzQ1Njc4OTwvQXR0cmlidXRlVmFsdWU+CjwvQXR0cmlidXRlPgoKPEF0dHJpYnV0ZSBOYW1lPSJlbWFpbCIgTmFtZUZvcm1hdD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOm5hbWVpZC1mb3JtYXQ6dHJhbnNpZW50IiBGcmllbmRseU5hbWU9Imdyb3VwcyI+CiAgPEF0dHJpYnV0ZVZhbHVlPmplcm1haW5AZ3JvdXBzaXRlLmNvbTwvQXR0cmlidXRlVmFsdWU+CjwvQXR0cmlidXRlPgoKPEF0dHJpYnV0ZSBOYW1lPSJmaXJzdF9uYW1lIiBOYW1lRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6bmFtZWlkLWZvcm1hdDp0cmFuc2llbnQiIEZyaWVuZGx5TmFtZT0iZ3JvdXBzIj4KICA8QXR0cmlidXRlVmFsdWU+SmVybWFpbjwvQXR0cmlidXRlVmFsdWU+CjwvQXR0cmlidXRlPgoKPEF0dHJpYnV0ZSBOYW1lPSJsYXN0X25hbWUiIE5hbWVGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpuYW1laWQtZm9ybWF0OnRyYW5zaWVudCIgRnJpZW5kbHlOYW1lPSJncm91cHMiPgogIDxBdHRyaWJ1dGVWYWx1ZT5TbWl0aDwvQXR0cmlidXRlVmFsdWU+CjwvQXR0cmlidXRlPgoKPEF0dHJpYnV0ZSBOYW1lPSJncm91cHMiIE5hbWVGb3JtYXQ9InVybjpvYXNpczpuYW1lczp0YzpTQU1MOjIuMDpuYW1laWQtZm9ybWF0OnRyYW5zaWVudCIgRnJpZW5kbHlOYW1lPSJncm91cHMiPgogIDxBdHRyaWJ1dGVWYWx1ZT5odHRwczovL2plcm1haW50ZXN0Lmdyb3Vwc2l0ZS5ibHVlPC9BdHRyaWJ1dGVWYWx1ZT4KICA8QXR0cmlidXRlVmFsdWU+aHR0cHM6Ly90ZXN0Y2hhbmdlc3Vic2NyaXB0aW9uLmdyb3Vwc2l0ZS5ibHVlPC9BdHRyaWJ1dGVWYWx1ZT4KPC9BdHRyaWJ1dGU+CjxBdHRyaWJ1dGUgTmFtZT0ia2V5IiBOYW1lRm9ybWF0PSJ1cm46b2FzaXM6bmFtZXM6dGM6U0FNTDoyLjA6bmFtZWlkLWZvcm1hdDp0cmFuc2llbnQiIEZyaWVuZGx5TmFtZT0iZ3JvdXBzIj4KICA8QXR0cmlidXRlVmFsdWU+CiAgICAtLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLQogICAgTUlHZk1BMEdDU3FHU0liM0RRRUJBUVVBQTRHTkFEQ0JpUUtCZ1FEQk1wSU1OaHE0NGNZNFJVMmJZQTROTUQ0MAogICAgclozSGl4bUorTUxwZjJpcUgyK3hqRGUxdTdkQVIzTG4zNFdsM2p0TEJYSmZYMjF0N0NWUnJNbm5Vd21XMFFUVQogICAgQ250TGplWjJuTzJCTWExajBiWDhyd0YvWTVvbEhDbVV6NmxNRlBXQ21hbjBxOG5Sb0hqWS9SYkVIMnAyUkttSAogICAgZURDRW5LaHZHS0pqejVja0J3SURBUUFCCiAgICAtLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0KPC9BdHRyaWJ1dGVWYWx1ZT4KPC9BdHRyaWJ1dGU+Cgo='

  constructor(private http: HttpClient, private router: Router, private Auth: AuthService) {
    
   }
   groupsiteSSOConnect(){
    this.http.post("https://sso.groupsite.blue/saml/consume/ravensst", this.samltobase64).subscribe(res => {
      console.log('sent:', res );
    })
   }

   getImageGalleryListener(){
    console.log('sending slides');
    return this.imageGalleryUpdate.asObservable();
  }
  getPictureUpdateListener(){
    return this.pictureUpdated.asObservable();
  }
  getUserPic() {
    console.log('profile service userpic', this.userPic)
    this.pictureUpdated.next(this.userPic) 
  }
  getRouterStatusListener(){
    return this.routerStatusListener.asObservable();
  }
  getProfiles() {
    const userPic = '';
    const profileId = sessionStorage.getItem('profile_id')
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
            profiles: profileData.profiles.map((profile: { _id: string; fullname: string; imagePath: string; email: string; location: string; username: string; gender: string; interest: string; creator: string; friends: []; friendsAmt: number;  imageGallery: ImageGallery[], videoGallery: VideoGallery[], online: string}) => {
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
                  friendsAmt: profile.friendsAmt,
                  imageGallery: profile.imageGallery,
                  videoGallery: profile.videoGallery,
                  online: profile.online
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
                friendsAmt: profile.friendsAmt,
                imageGallery: profile.imageGallery,
                videoGallery: profile.videoGallery,
                online: profile.online
              } };
            }),
          };
        })
      )
      .subscribe(transformedprofileData => {
        this.profiles.push(transformedprofileData.profiles);
        this.profiles = transformedprofileData.profiles;
        this.profilesUpdated.next({

          profiles: [...this.profiles]
        });
      });
       this.profiles.filter(profile => {
        if(profile.id == profileId) {
          console.log('profile.imagePath', profile.imagePath)
          this.userPic = profile.imagePath;
          this.pictureUpdated.next(profile.imagePath)        
        }
      });
  }
  logout() {
    const id = sessionStorage.getItem('userId') as string;
    const data = {id};
    console.log('id in auth service', id)
    this.http.patch<{message: string}>(backendURL, data).subscribe(res => console.log(res.message));

  }
  getCreator(receivername: string) {
   const profile = this.profiles.find(profile => profile.username == receivername);
   return profile?.creator;
    
  }
  unliked(id: any, username: string, mediaId: string) {
    const likeData: Like = {id, username, mediaId};
    this.http.patch<{message: string}>(backendURLImageLike, likeData).subscribe(res => console.log(res.message));
  }
  unDisliked(id: any, username: string, imageId: string) {
    const dislikeData: Dislike = {id, username};
    this.http.patch<{message: string}>(backendURLDislike, dislikeData).subscribe(res => console.log(res.message));
  }
  liked(id: any, username: string, mediaId: string) {
    const likeData: Like = {id, username, mediaId};
    console.log('liked', likeData);
    this.http.put<{message: string}>(backendURLImageLike, likeData).subscribe(res => console.log(res.message));
  }
  likedVideo(id: any, username: string, mediaId: string) {
    const likeData: Like = {id, username, mediaId};
    console.log('liked', likeData);
    this.http.put<{message: string}>(backendURLVideoLike, likeData).subscribe(res => console.log(res.message));
  }
  unlikedVideo(id: any, username: string, mediaId: string) {
    const likeData: Like = {id, username, mediaId};
    this.http.patch<{message: string}>(backendURLVideoLike, likeData).subscribe(res => console.log(res.message));
  }
  disliked(id: any, username: string, videoId: string) {
    const dislikeData: Dislike = {id, username};
    this.http.put<{message: string}>(backendURLDislike, dislikeData).subscribe(res => console.log(res.message));
  }

  getImageGallery() {
    this.imageGalleryUpdate.next(this.slides)
  }
  imageGalleryDisplay(slides: SlideInterface[]) {
    this.slides = slides;
  }
  changeProfilePic(imagePath: File) {  
    const id = localStorage.getItem('userId') as string;
    const title = 'updated pic';
    const profileData = new FormData()
    profileData.append('id', id)
    profileData.append('image', imagePath, title)
    this.http.put<{message: string, image: string, profiles: any}>(backendURLPics, profileData).subscribe( returnData => {
      // this.getProfiles();
      console.log('change profile pic message', returnData.message)
      this.userPic = returnData.image;
      this.pictureUpdated.next(returnData.image);
      this.profilesUpdated.next(returnData.profiles);
    });
  }
  addProfileVideos(title: string, path: File, id: string) {
    console.log('id in service', id)
    const profileData = new FormData();
    if(typeof path === 'object' ) {
      console.log('in Add profile Images func', path)
      profileData.append('id', id);
      profileData.append('title', title);
      profileData.append('video', path, title);
    } else {
      console.log('image path is not a file')
      return
    }
    this.http.post<{
      message: string
    }>(backendURLVideos, profileData )
    .subscribe(response => {
      console.log('response message adding profile images', response.message)
      // this.getProfiles();
      // this.pictureUpdated.next(response.profile.imagePath);
    });
  }
  addProfileImages(title: string, path: File, id: string) {
    const profileData = new FormData();
    console.log('id', id);
    if(typeof path === 'object' ) {
      console.log('in Add profile Images func', path)
      profileData.append('id', id);
      profileData.append('title', title);
      profileData.append('image', path, title);
    } else {
      console.log('image path is not a file')
      return
    }
    this.http.patch<{
      message: string
    }>(backendURLPics, profileData )
    .subscribe(response => {
      console.log('response message adding profile images', response.message)
      // this.getProfiles();
      // this.pictureUpdated.next(response.profile.imagePath);
    });
  }
  deleteProfileImages(id: string) {
    this.http.delete<{message: string}>(backendURLPics + id).subscribe(res => {
      console.log('res from deletion', res.message);
    })
  }
  getProfileEdit(id: string) {
    this.http.get<{message: string, profile: Profile}>(
      backendURL + id)
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
  getProfile2(id: string) {
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
             interest: string, imagePath: File) {
               const profileData = new FormData();
               profileData.append('username', username);
               profileData.append('location', location);
               profileData.append('fullname', fullname);
               profileData.append('email', email);
               profileData.append('gender', gender);
               profileData.append('interest', interest);
               profileData.append('image', imagePath, username);
    this.http.
      post<{ message: string;
             profile: any }>
      (
        backendURL, profileData
      )
      .subscribe(returndata => {
        this.userPic = returndata.profile._doc.imagePath;
        this.pictureUpdated.next(returndata.profile._doc.imagePath);
        this.profileEditUpdate.next(returndata.profile._doc)
        this.getProfiles();

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
                friendsAmt: number,
                imageGallery: ImageGallery[],
                videoGallery: VideoGallery[]) {
let profileData: Profile | FormData;
this.mode = 'edit';
if (typeof image === 'object') {
  console.log('in formData profile service')
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
    id: id, username: username, email: email, imagePath: image, location: location, interest: interest, gender: gender, fullname: fullname, creator: creator, friends, friendsAmt, imageGallery, videoGallery

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
    this.getProfiles();
    this.userPic = returnData.profile.imagePath;
    this.pictureUpdated.next(returnData.profile.imagePath);
    this.profileEditUpdate.next(returnData.profile)
    this.router.navigate(['/']);
    console.log('profile added')
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

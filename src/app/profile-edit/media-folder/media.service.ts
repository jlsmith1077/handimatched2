import { Injectable } from '@angular/core';
import { Media } from './media.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Form, NgForm } from '@angular/forms';
import { map, tap} from 'rxjs/operators';
import { Router } from '@angular/router';
// import { FileType } from './file-type-enum';
import { environment } from '../../../environments/environment';

const backendURL = environment.apiURL + '/video/';


@Injectable({
    providedIn: 'root',
})
export class VideoService {
//   fileType: FileType;
    mode = 'login';
    loadedPosts: Media[] = [];
    id = '';
    username = '';
    title = '';
    messageForm: NgForm | undefined;
    vpChanged = new Subject<{videos: Media[]}>();
    modeChange = new Subject();

    private videos: Media[] = [];

    constructor(private http: HttpClient,
                private router: Router) {}

    getVideos() {
        // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{
            message: string;
            videos: any,
            maxVideos: number
        }>(backendURL)
           .pipe(
        map(videoData => {
          return {
            videos: videoData.videos.map((video: {
                username: any;
                title: any;
                _id: any;
                videoPath: any;
                creator: any;
                message: string;
                videos: any;
                maxVideos: any;
}) => {
              return {
                username: video.username,
                title: video.title,
                id: video._id,
                videoPath: video.videoPath,
                creator: video.creator
              };
            }),
            maxVideos: videoData.maxVideos
          };
        })
      )
            .subscribe(transformedVideosData => {
                this.videos = transformedVideosData.videos;
                this.vpChanged.next({
                    videos: [...this.videos]
                });
            });
    }
    getVideoUpdateListener() {
        return this.vpChanged.asObservable();
    }
    getModeUpdateListener() {
        return this.modeChange.asObservable();
    }

    getVideo(id: string) {
        return this.http.get<{ _id: string,
             username: string,
             title: string,
             videoPath: string,
             creator: string
            }>
        (backendURL + id);
    }
    addVideo(username: string,  video: File, title: string, creator: string) {
        const videoData = new FormData();
        videoData.append('username', username);
        videoData.append('video', video, title);
        videoData.append('title', title);
        videoData.append('creator', creator)
        this.http.post<{
            message: string;
            video: Media
        }>(backendURL, videoData)
            .subscribe(responseData => {
              console.log('response data from node', responseData);
                this.router.navigate(['/']);
            });
    }
    updateVideo(id: string, username: string,  video: File | string, title: string,creator: string) {
      let videoData: Media | FormData;
      this.mode = 'edit';
      if(typeof video === 'object'){
         const videoData = new FormData();
            videoData.append('video', video, title);
            videoData.append('title', title);
            videoData.append('creator', creator);
      }}
            //   } else {
            //     videoData = {
            //         title,
            //         path: video
            //     };
            // }
    //   this.http.patch<{ [username: string]: Video }>
    //         (backendURL + id, videoData = videoData!)
    //         .pipe(
    //             map(responseData => {
    //         const videosArray: Video[] = [];
    //         // tslint:disable-next-line: no-shadowed-variable
    //         for (const username in responseData) {
    //             if (responseData.hasOwnProperty(username)) {
    //         videosArray.push({...responseData[username], id: username});
    //             }
    //         }
    //         return videosArray;
    //         })
    //         )
    //         .subscribe(videos => {
    //             this.loadedPosts = videos;
    //             this.router.navigate(['/']);
    //         });
    // }

    // updateMessage() {}

    // deletePost(id: string) {
    //   return  this.http.delete(backendURL + id);
    // }


}

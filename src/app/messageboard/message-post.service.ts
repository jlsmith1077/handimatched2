import { Injectable } from '@angular/core';
import { Post } from './message-post.model';
import { Like } from '../like/like.model';
import { Dislike } from '../like/dislike.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { map, tap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Comment } from './comment.model';
const backendURL = environment.apiURL + "/posts/";
const backendURL2 = environment.apiURL + "/like/";
const backendURL4 = environment.apiURL + "/dislike/";
const backendURL3 = environment.apiURL + "/comments/";




@Injectable({
    providedIn: 'root',
})
export class MessagePostService {
    currentPage: number | undefined ;
    postsperpage: number | undefined ;
    comment: string = '';
    commentor: string = '';
    mode = 'login';
    loadedPosts: Post[] = [];
    format = '';
    id = '';
    username = '';
    messagepost = '';
    messageForm!: NgForm;
    mpChanged = new Subject<{posts: Post[]}>();
    modeChange = new Subject() as any;

    private posts: Post[] = [];
    private comments: Comment[] = [];

    constructor(private http: HttpClient,
                private router: Router) {}
    

    getMessagePosts() {
        // const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
        // const postsperpage = JSON.stringify(postsPerPage);
        // const currentpage = JSON.stringify(currentPage);
        // sessionStorage.setItem('postsperpage', postsperpage);
        // sessionStorage.setItem('currentpage', currentpage);
        this.http.get<{
            message: string;
            posts: any,
            maxPosts: number
        }>(backendURL)
           .pipe(
        map(postData => {
          return {
            posts: postData.posts.map((post: { username: any; messagepost: any; _id: any; imagePath: any; creator: any; format: any; section: any; time: any; title: any, privacy: any, location: any, likes: any; likesAmt: any; dislikes: any; dislikesAmt: any; comments: Comment; userPic: any; }) => {
              return {
                id: post._id,
                username: post.username,
                messagepost: post.messagepost,
                imagePath: post.imagePath,
                format: post.format,
                section: post.section,
                time: post.time,
                title: post.title,
                privacy: post.privacy,
                location: post.location,
                userPic: post.userPic,
                creator: post.creator,
                likes: post.likes,
                likesAmt: post.likesAmt,
                dislikes: post.dislikes,
                dislikesAmt: post.dislikesAmt,
                comments: post.comments
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
        ).subscribe(transformedPostsData => {
                console.log('comment', transformedPostsData.posts)
                this.posts.push(transformedPostsData.posts);
                this.posts = transformedPostsData.posts.reverse();
                this.mpChanged.next({
                  posts: [...this.posts]
                });
            });
    }  
  addComment(id: string, comment: string ) {
    const commentor = sessionStorage.getItem('username');
    const commentData = {id, comment, commentor};
    this.http.put<{posts: Post}>(backendURL3, commentData).subscribe(resData => {
      this.posts.push(resData.posts);
      this.getMessagePosts();
    });
  }
  changeSettingsAllPosts(settings: string) {
    const setting = settings;
    this.http.put<{message: string, setting: string}>
      (backendURL, setting).subscribe(returndata => console.log(returndata))
  }
  changeSettingsOnePost(id: string, settings: string) {
    const setting = settings;
    this.http.put<{message: string, setting: string}>(backendURL + id, setting);
  }

  unliked(id: any, username: string) {
    const likeData: Like = {id, username};
    this.http.patch<{message: string}>(backendURL2, likeData).subscribe(res => console.log(res.message));
  }
  unDisliked(id: any, username: string) {
    const dislikeData: Dislike = {id, username};
    this.http.patch<{message: string}>(backendURL4, dislikeData).subscribe(res => console.log(res.message));
  }
  liked(id: any, username: string) {
    const likeData: Like = {id, username};
    this.http.put<{message: string}>(backendURL2, likeData).subscribe(res => console.log(res.message));
  }
  disliked(id: any, username: string) {
    const dislikeData: Dislike = {id, username};
    this.http.put<{message: string}>(backendURL4, dislikeData).subscribe(res => console.log(res.message));
  }
    getPostUpdateListener() {
        return this.mpChanged.asObservable();
    }
    getModeUpdateListener() {
        return this.modeChange.asObservable();
    }
    commentMode() {
      this.mode = 'comment';
      this.modeChange.next(this.mode);
    }
    commentOff() {
      this.mode = '';
      this.modeChange.next(this.mode);
    }
    getPost(id: string) {
        return this.http.get<{ _id: string,
             username: string,
             messagepost: string,
             imagePath: string,
             creator: string,
             format: string,
             section: string,
             title: string,
             privacy: string,
             location: string,
             comments: [],
             userPic: any
            }>
        ( backendURL + id);
    }
    addmessagePost(username: string, messagepost: string, image: File | string, format: string, section: string, time: Date, title: string, privacy: string, location: string, userPic: string) {
      const postData = new FormData();
        postData.append('username', username);
        postData.append('messagepost', messagepost);
        postData.append('image', image, username);
        postData.append('format', format);
        postData.append('section', section);
        postData.append('time', time.toDateString());
        postData.append('title', title);
        postData.append('privacy', privacy);
        postData.append('location', location);
        postData.append('userPic', userPic);
        this.http.post<{
            message: string;
            post: Post
        }>( backendURL, postData)
            .subscribe(responseData => {
              this.mpChanged.next({
                posts: [...this.posts]
              });
              this.getMessagePosts();
              this.router.navigate(['/messageboard']);
            });
    }
    updatePost(id: string, username: string, messagepost: string, imagePath: File | string, format: string, section: string, time: Date, title: string, privacy: string, location: string, userPic: string) {
      let postData: Post | FormData;
      this.mode = 'edit';
      if (typeof imagePath === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('username', username);
            postData.append('messagepost', messagepost);
            postData.append('imagePath', imagePath, username);
            postData.append('format', format);
            postData.append('section', section);
            postData.append('time', time.toDateString());
            postData.append('title', title);
            postData.append('privacy', privacy);
            postData.append('location', location);
            postData.append('userPic', userPic);
            } else {
                postData = {
                    id,
                    username,
                    messagepost,
                    imagePath: imagePath,
                    creator: '',
                    format,
                    section,
                    time,
                    title,
                    location,
                    comments: [],
                    userPic
                };
            }
      this.http.patch<{ [username: string]: Post }>
            ( backendURL + id, postData)
            .pipe(
                map(responseData => {
            const postsArray: Post[] = [];
            // tslint:disable-next-line: no-shadowed-variable
            for (const username in responseData) {
                if (responseData.hasOwnProperty(username)) {
            postsArray.push({...responseData[username], id: username});
                }
            }
            return postsArray;
            })
            )
            .subscribe(posts => {
                this.loadedPosts = posts;
                this.router.navigate(['/']);
            });
    }

    getPost2(index: number) {
      return this.posts[index];
    }

    deletePost(postId: string) {
      return  this.http.delete( backendURL + postId);
      }
}

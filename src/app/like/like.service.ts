import { Like } from './like.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient }  from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../src/environments/environment.prod';

const backendURL = environment.apiURL + '/like/';

@Injectable({providedIn: 'root'})
export class LikeService {
    id: string = '';
    username: string = '';
    component: string = '';
    likedId: string = '';
    private likes: Like[] = [];
    private likeUpdated = new Subject<{likes: Like[]}>();

    constructor(private http: HttpClient, private router: Router) {}
    
    getLikes() {
        this.http.get<{
            message: string,
            likes: any
        }>(backendURL).
        pipe(map((likeData) => {
            return likeData.likes.map((like: { username: any; _id: any; }) => {
                return {
                    username: like.username,
                    id: like._id
                };
            });
        })).
        subscribe(transformedLike => {
            this.likes = transformedLike;
            this.likeUpdated.next({
                likes: [...this.likes]});
        });
    }

    getLikeUpdateListener() {
        return this.likeUpdated.asObservable();
    }
    createLike( id: string, username: string) {
        const likeData: Like = {id, username};
        this.http.put<{}>(backendURL, likeData).
        subscribe(responseData => {
            console.log(responseData);
            this.likeUpdated.next({
                likes: [...this.likes]});
        });
    }
    // getLike(id: string) {
    //     return {...this.likes.find(like => like.likedId === id)};
    // }
    getLikeById(id: string) {
        return {...this.likes.find(likes => likes.id === id)}
    }
    // deleteLike(likedId: string) {
    //     this.http.delete(backendURL + likedId).
    //     subscribe(() => {
    //         this.likeUpdated.next({
    //             likes: [...this.likes]});
    //     });
    // }
}
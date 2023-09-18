import { Component, Input, OnInit } from '@angular/core';
import { Profile } from 'src/app/profile.model';
import { ProfileService } from 'src/app/profile.service';

interface mediaArray {
  id?: string;
  path?: string,
  title?: string,
  likes?: string[],
  likeAmt?: number
}

@Component({
  selector: 'app-yourgallery',
  templateUrl: './yourgallery.component.html',
  styleUrls: ['./yourgallery.component.css']
})


export class YourgalleryComponent implements OnInit {
  @Input() profile?: Profile;
  imageArray: mediaArray[] = [];
  videoArray: mediaArray[] = [];
  image: string = '';
  video: string = '';
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    if(this.profile?.imageGallery) {
      this.profile.imageGallery!.forEach(image => {
        if(typeof image.path == 'string'){
          this.imageArray.push({id: image._id, path: image.path, title: image.title, likes: image.likes, likeAmt: image.likesAmt})
        }
      });
      this.profile.videoGallery?.forEach(video => {
        if(typeof video.path === 'string'){
          this.videoArray.push({id: video._id, path: video.path, title: video.title, likes: video.likes, likeAmt: video.likesAmt})
        }
      })
    }
  }

}

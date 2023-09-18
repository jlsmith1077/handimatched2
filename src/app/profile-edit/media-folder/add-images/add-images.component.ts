import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Profile } from 'src/app/profile.model';
import { ProfileService } from 'src/app/profile.service';
import { SwipeDirective } from 'src/app/swipe.directive';

interface mediaArray {
  path: string,
  title: string
}

@Component({
  selector: 'app-add-images',
  templateUrl: './add-images.component.html',
  styleUrls: ['./add-images.component.css']
})
export class AddImagesComponent implements OnInit {
  @Input() profile?: Profile
  openUploadVideo: Boolean = false;
  openRecordVideo: Boolean = false;
  imageArray: mediaArray[] = [];
  videoArray: mediaArray[] = [];
  enableSaveMedia: Boolean = false
  enableSaveVideo: Boolean = false
  pictureAdded: Boolean = false;
  videoAdded: Boolean = false;
  profileAddImageForm!: FormGroup;
  profileAddVideoForm!: FormGroup;
  imagePreview: string | undefined;
  videoPreview: string | undefined;
  image: string = '';
  video: string = '';
  profileId: string = '';
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    if(this.profile?.imageGallery) {
      this.profile.imageGallery!.forEach(image => {
        if(typeof image.path == 'string'){
          this.imageArray.push({path: image.path, title: image.title})
        }
      });
      this.profile.videoGallery?.forEach(video => {
        if(typeof video.path === 'string'){
          this.videoArray.push({path: video.path, title: video.title})
        }
      })
    }
    this.profileAddImageForm = new FormGroup({
      'title': new FormControl(null),
      'path': new FormControl(null),
    })
    this.profileAddVideoForm = new FormGroup({
      'title': new FormControl(null),
      'path': new FormControl(null),
    })
  }
  onImagePicked(event: Event) {
    this.enableSaveMedia = true;
    this.pictureAdded = true;
    console.log('pic add', this.pictureAdded)
    const file = (event.target as HTMLInputElement).files![0];
    this.profileAddImageForm.patchValue({path: file});
    this.profileAddImageForm.get('path')!.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
      }
  onVideoPicked(event: Event) {
    this.enableSaveVideo = true;
    this.videoAdded = true;
    console.log('vid add', this.videoAdded)
    const file = (event.target as HTMLInputElement).files![0];
    this.profileAddVideoForm.patchValue({path: file});
    this.profileAddVideoForm.get('path')!.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.videoPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
      }

      onSubmit() {
        const id = localStorage.getItem('userId') as string;
        console.log('id in component', id)
        this.enableSaveMedia = false;
        this.imagePreview = '';
        console.log("submitted", this.profileAddImageForm.value.title, this.profileAddImageForm.value.path);
        if(this.profileAddImageForm.value.title == null) {
          this.profileAddImageForm.patchValue({
            title: 'no title'
          });
    }
      console.log('submitting media..title and image. --- ', ' - ', id)
      this.profileService.addProfileImages(this.profileAddImageForm.value.title, this.profileAddImageForm.value.path, id) 
      }
      onVideoSubmit() {
        const id = localStorage.getItem('userId') as string;
        this.enableSaveVideo = false;
        this.videoPreview = '';
        sessionStorage.setItem('userId', this.profileId!);
        console.log("submitted", this.profileAddVideoForm.value.title, this.profileAddVideoForm.value.path);
        if(this.profileAddVideoForm.value.title == null) {
          this.profileAddVideoForm.patchValue({
            title: 'no title'
          });
    }
      // console.log('submitting media..title and image. --- ', this.profileAddVideoForm.value.title, this.profileAddVideoForm.value.path, ' - ', id)
      this.profileService.addProfileVideos(this.profileAddVideoForm.value.title, this.profileAddVideoForm.value.path, id) 
      }
      
      openRecord() {
      if(this.openRecordVideo == false) {
        this.openRecordVideo = true;
      } else {
        this.openRecordVideo = false;
      }
    }
    openUpload() {
      if(this.openUploadVideo == false) {
        this.openUploadVideo = true;
      } else {
        this.openUploadVideo = false;
      }
      
    } 
}

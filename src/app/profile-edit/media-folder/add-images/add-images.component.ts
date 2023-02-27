import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Profile } from 'src/app/profile.model';
import { ProfileService } from 'src/app/profile.service';

@Component({
  selector: 'app-add-images',
  templateUrl: './add-images.component.html',
  styleUrls: ['./add-images.component.css']
})
export class AddImagesComponent implements OnInit {
  @Input() profile?: Profile
  imageArray: any = [];
  enableSaveMedia: Boolean = false
  pictureAdded: Boolean = false;
  profileAddImageForm!: FormGroup;
  imagePreview: string | undefined;
  image: string = '';
  profileId: string = '';
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.profile?.imageGallery.forEach(image => {
      this.imageArray.push(image.path);
    })
    this.profileAddImageForm = new FormGroup({
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

      onSubmit() {
        this.enableSaveMedia = false;
        this.imagePreview = '';
        sessionStorage.setItem('userId', this.profileId!);
        console.log("submitted", this.profileAddImageForm.value.title, this.profileAddImageForm.value.path);
        if(this.profileAddImageForm.value.title == null) {
          this.profileAddImageForm.patchValue({
            title: 'no title'
          });
    }
    console.log('title', this.profileAddImageForm.value.title)
    this.profileService.addProfileImages(this.profileAddImageForm.value.title, this.profileAddImageForm.value.path) 
      }
}

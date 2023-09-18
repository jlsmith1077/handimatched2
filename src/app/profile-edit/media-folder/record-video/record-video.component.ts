import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from '../../../profile.service';
import { RecordVideoService } from './record-video.service';

type RecordingState = 'NONE' | 'RECORDING' | 'RECORDED';

@Component({
  selector: 'app-record-video',
  templateUrl: './record-video.component.html',
  styleUrls: ['./record-video.component.css']
})
export class RecordVideoComponent implements OnInit, AfterViewInit{
  interval?: any;
  numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  secondsToStart: number = 0;
  changedSecondsToStart: number = 0;
  @ViewChild('videoElement') videoElement: any;
  title = 'record-rtc-screen-demo';
  username?: string
  videoBlobUrl: any = null;
  video: any;
  state: RecordingState = 'NONE';
  recordType: boolean = false; // false will be video true will be canvas
  saveTitleToVideo: boolean = false;
  titleForm!: FormGroup;

  profileForm!: FormGroup;
  imagePreview: string = '';
  

  constructor(
        private videoService: RecordVideoService,
        private profileService: ProfileService,
        private ref: ChangeDetectorRef,
        private sanitizer: DomSanitizer
        ) {
    this.videoService.getMediastreamListener().subscribe((data) => {
      this.video.srcObject = data;
      this.ref.detectChanges();
    })
    this.videoService.getBlobListener().subscribe((video) => {
      console.log('blob', video);
      this.video.srcObject = null;
      this.videoBlobUrl = this.sanitizer?.bypassSecurityTrustResourceUrl(video);
      this.videoElement.srcObject
      this.ref?.detectChanges();
    })
  }
  ngOnInit(): void {
    this.username = localStorage.getItem('username') as string;
    this.titleForm = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]
      })
    })
    this.profileForm = new FormGroup({
      'imagePath': new FormControl(null),
    });  
  }

  ngAfterViewInit(): void {
    this.video = this.videoElement.nativeElement;
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.profileForm.patchValue({imagePath: file});
    this.profileForm.get('imagePath')!.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
      }
      changeSecondsforSetTimeout(num: number) {
        switch(num){
          case 0:
          return;
          break;
          case 1:
          this.changedSecondsToStart = 1000;
          break;
          case 2:
          this.changedSecondsToStart = 2000;
          break;
          case 3:
          this.changedSecondsToStart = 3000;
          break;
          case 4:
          this.changedSecondsToStart = 4000;
          break;
          case 5:
          this.changedSecondsToStart = 5000;
          break;
          case 6:
          this.changedSecondsToStart = 6000;
          break;
          case 7:
          this.changedSecondsToStart = 7000;
          break;
          case 8:
          this.changedSecondsToStart = 8000;
          break;
          case 9:
          this.changedSecondsToStart = 9000;
          break;
          case 10:
          this.changedSecondsToStart = 10000;
          break;
        }
        console.log('this.secondsTostart', this.secondsToStart, this.changedSecondsToStart);
      }
      startInChosenSeconds(secondsToStart: any) {
        setTimeout(() =>{ 
          console.log('interval set', this.changedSecondsToStart)
          this.videoService.startRecording()
        }, secondsToStart);
     }
     countDown(){
      if(this.secondsToStart == 0)
      {
        clearInterval(this.interval);
      }else {
        this.secondsToStart--
      }
    }
    startRecording() {
       console.log('starting recroding', this.secondsToStart)
        this.changeSecondsforSetTimeout(this.secondsToStart);
        if(this.secondsToStart == 0) {
          this.videoService.startRecording();
          console.log('started recording', this.secondsToStart)
        } else {
          console.log('delayed starting recording', this.secondsToStart)
          this.startInChosenSeconds(this.changedSecondsToStart);  
          this.interval = setInterval(() => {
            this.countDown();
            console.log(this.secondsToStart)
        }, 1050);        
        }
        
        this.state = 'RECORDING';
        setTimeout(() =>{ 
          this.stopRecording()
        }, 47000);
      }
  startCanvasRecording() {
    this.videoService.startCanvasRecording();
    this.state = 'RECORDING';
  }
  stopRecording() {
    this.videoService.stopRecording();
    this.state = 'RECORDED';
    this.openTitleElement();
  }
  downloadRecording() {
    this.videoService.downloadRecording();
  }
  saveRecording(event: any) {
    event.stopPropagation();
    const title = this.titleForm?.value.title;
    this.videoService.saveRecording(title);
    console.log('saved recording is component')
  }
  openTitleElement() {
    if(this.saveTitleToVideo == true) {
      this.saveTitleToVideo = false;
    } else {
      this.saveTitleToVideo = true;
    }
  }
  clearRecording() {
    this.videoService.clearRecording();
    this.video.srcObject = null;
    this.videoBlobUrl = null;
    this.state = 'NONE';
  }
  setRecordingType() {
    if(!this.recordType) {
      this.recordType = true;
    } else {
      this.recordType = false;
    }
  }

}

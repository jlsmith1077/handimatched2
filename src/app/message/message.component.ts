import { Component, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Validators, FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { MailService } from './mail.service';
import { Mail } from './mail.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/authentication/auth.service';
import { Profile } from '../profile.model';
import { ProfileService } from '../profile.service';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  fileArray: File[] = [];
  fileNames: string[] = [];
  images: string[] = [];
  @Input() receivername = '';
  receiverCreator: string = '';
  username!: string;
  userPic!: string;
  currentDateAndTime: any = {};
  form!: FormGroup;
  imagePreview!: string;
  visibilty!: string; 
  format!: string;
  enteredContent!: '';
  id!: string;
  private mailSub!: Subscription;
  private userPicSub!: Subscription;
  private profile!: Profile;
  mails: Mail[] = [];
  mail!: string;
  openMail = false;
  opened!: string;
  private isOpen = new Subject<boolean>();
  @Output() mode = new Subject<string>(); 

  constructor(private http: HttpClient,
              private profileService: ProfileService,
              private mailservice: MailService,
              private authService: AuthService,
              private route: ActivatedRoute,
              private fb: FormBuilder) {
                this.form = this.fb.group({
                  content1: "",
                  image: this.fb.array([]),
                  video: ""
                })
              }

  ngOnInit() {
    
    // this.form = new FormGroup({
    //   content1: new FormControl(null, {validators: [Validators.required]} ),
    //   image: new FormArray([]),
    //   video: new FormControl(null)
    // });
    this.authService.getUserStatusListener().subscribe(returnData => {
      this.profile = returnData.profile;
      this.username = returnData.profile.username;
    })
    this.currentDateAndTime = new Date().toLocaleString();
    console.log('currentDateAndTime', this.currentDateAndTime);
    
    this.mailSub = this.mailservice.getMailUpdateListener()
      .subscribe((mails: Mail[]) => {
        this.mails = mails;
      });
      this.route.fragment.subscribe((fragment) => { 
        if (fragment && document.getElementById(fragment) != null) {
          document.getElementById(fragment)!.scrollIntoView({ behavior: "smooth" });
        }
      });
    this.userPicSub = this.profileService.getPictureUpdateListener().
    subscribe((pic) => {
      console.log('picture', pic);
      this.userPic = pic
    });
    this.profileService.getUserPic();
    
  }

  get imagesControllers() : FormArray {
    return <FormArray>this.form.get('image')
  }
  myFunction(item: number, index: string | number, arr: { [x: string]: number; }) {
    arr[index] = item * 10;
  }
private createImagesFormGroup(): FormGroup{
  return new FormGroup({
    image: new FormControl('')
  })
}
addImages() {
    const images = this.form.get('image') as FormArray;
    images.push(this.createImagesFormGroup())
}
  removeImage(i: number) {
    const images = this.form.get('image') as FormArray;
    if(images.length > 1) {
      images.removeAt(i)
    } else {
      images.reset()
    }
  }

  onCancel() {
    this.mode.next('login');
    this.isOpen.next(false);
    //this.router.navigate(['/']);
  }
  onImagePicked(event: any) {
    const arr = (event.target as HTMLInputElement).files
    if(arr) {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        const reader = new FileReader();
        reader.onload = () => {
          const imageString = reader.result as string;
        console.log('element', element, '-', imageString)
        this.images.push(imageString)
        this.fileArray.push(element)
        }
        reader.readAsDataURL(element);
      } 
    }
      console.log('images2', this.images, this.fileArray)    
  }
  onCreateMail() {
    const messageTime = this.currentDateAndTime;
    this.mode.next('create');
    if (this.form.invalid) {
      return;
    }
    let opened: string = 'false';
    this.id = localStorage.getItem('id') as string;
    const userpic = this.userPic;
    const receivername = this.receivername;
    const username = sessionStorage.getItem('username') as string;
    const video = this.form.value.video;
    const content1 = this.form.value.content1;
    this.receiverCreator = this.profileService.getCreator(this.receivername)!;
    const receiverCreator = this.receiverCreator;
    const creator = sessionStorage.getItem('userId') as string;
    console.log('mesageMedia', this.images);
    this.mailservice.createMail(content1, creator, receiverCreator, username, receivername, messageTime, userpic, this.fileArray, video, opened);
    this.form.reset();
    this.mode.next('login');
  }
  onClearMail() {
    // Send Http request
  }

ngOnDestroy() {
  this.mailSub.unsubscribe();
  this.userPicSub.unsubscribe();
}

}

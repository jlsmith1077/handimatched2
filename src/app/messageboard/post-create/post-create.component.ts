import { Component, OnInit, OnDestroy, Output, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { MessagePostService } from '../message-post.service';
import { FormGroup, FormControl, Validators, MinLengthValidator } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../message-post.model';
import { Subscription, Subject } from 'rxjs';
import { AuthService } from '../../authentication/auth.service';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  private location: string = '';
  @Output()
  @Output() editmode = new  Subject<{mode: string}>();
  mode = 'login';
  private postId!: string;
  messagepost: string = '';
  post!: Post;
  isLoading = false;
  form!: FormGroup;
  imagePreview!: string;
  private authStatusSub?: Subscription;
  username!: string;
  @ViewChild('comment', { static: true})
  private comment!: ElementRef;
  visibilty!: string; 
  format!: string;
  time!: Date;
  userPic!: string;
  section!: string;
  sections = [
    {type: 'Forums', name: [
      'vent', 'events', 'discussions'
      ]
    },
    {type: 'ads', name: [
      'women for men', 'men for women', 'women for women', 'men for men'
      ]
    }
  ];
  privacyOpt: string[] = [
    'everyone',
    'just friends',
    'just me'
  ];

  constructor(
    private mpService: MessagePostService,
     public route: ActivatedRoute,
     public authService: AuthService,
     private renderer: Renderer2,
     private elRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.time = new Date();   
    this.getUserPic();
    this.getLocation();
    const text = this.renderer.createText(this.username!);
    this.userPic = sessionStorage.getItem('userPic')!;
    this.username = sessionStorage.getItem('username')!;
    this.editmode.subscribe();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
     username: new FormControl(this.username, {validators: [Validators.required] }),
     messagepost: new FormControl(null, {validators: [Validators.required] }),
     image: new FormControl(null),
     format: new FormControl(null, {validators: [Validators.required] }),
     section: new FormControl(null, {validators: [Validators.required] }),
     title: new FormControl(null, {validators: [Validators.required] }),
     privacy: new FormControl('everyone', {validators: [Validators.required] }),
     location: new FormControl(this.location, {validators: [Validators.required] }),
     userPic: new FormControl(this.userPic, {validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
         this.postId = paramMap.get('postId')!;
         this.isLoading = true;
         this.mode = 'edit';
         this.mpService.getPost(this.postId!).subscribe(postData => {
           this.isLoading = false;
           if (this.username === postData.username) {
             this.username = this.post!.username;
           }
           this.post = {
              id: postData._id,
              username: this.username!,
              messagepost: postData.messagepost,
              imagePath: postData.imagePath,
              creator: postData.creator,
              format: this.format!,
              section: postData.section!,
              time: this.time,
              title: postData.title!,
              privacy: postData.privacy!,
              location: this.location,
              comments: postData.comments,
              userPic: postData.userPic

             };
           // may find some code to wrap the form setValue so it is placed in seperate div
          //  this.form!.setValue({
          //      username: this.username,
               // tslint:disable-next-line: max-line-length tslint:disable-next-line: quotemark
              //  messagepost: this.post.messagepost + '\n' + '\n' + '  ' + this.username + "'s",
              //  image: this.post.imagePath
              // });
         });
      } else {
        this.mode = 'login';
        this.postId = '';
      }
    });
  }
  getLocation() {
    const checkLocation = localStorage.getItem('location');
    if(checkLocation) {
      this.location = checkLocation;
    } else {
      this.location = '';
    }   
  }
  getUserPic() {
    this.userPic = sessionStorage.getItem('userPic')!;
    if(!this.userPic) {
      this.userPic = 'http://localhost:3000/images/default_pic';
    }
    console.log('userPIc in PostCreate', this.userPic);
  }
  addElement() {
    let newDiv = document.createElement('div');
    let newContent = document.createTextNode(this.post!.username);
    newDiv.appendChild(newContent);
    let currentDiv = document.getElementById('div1');
    document.body.insertBefore(newDiv, currentDiv);
   }

   onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    console.log(file)
    this.form!.patchValue({image: file});
    this.form!.get('image')!.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    if(file.type.indexOf('image')> -1) {
      this.format = 'image';
    } else if(file.type.indexOf('video')> -1) {
      this.format = 'video';  
    }
    reader.onload = () => {
      this.imagePreview = reader.result as string;      
    };
    
  }
  changePrivacy(value: any) {
      //use .value if you want to get the key of Option
    console.log(value );
  }
  changeValue(value: any) {
      //use .value if you want to get the key of Option
    console.log(value );
  }
  onSavePost() {
    this.isLoading = true;
    if (this.mode === 'login') {
      this.mpService.addmessagePost(
        this.username,
        this.form!.value.messagepost,
        this.form!.value.image,
        this.format!,
        this.form!.value.section,
        this.time,
        this.form!.value.title,
        this.form!.value.privacy,
        this.form!.value.location,
        this.userPic!
        );
    } else {
      this.mpService.updatePost(
      this.postId!,
      this.username,
      this.form!.value.messagepost,
      this.form!.value.image,
      this.format!,
      this.form!.value.section,
      this.time,
      this.form.value.postTitle,
      this.form.value.privacy,        
      this.form.value.location,
      this.userPic!
      );
    }
    this.form!.reset();
  }
  ngOnDestroy() {
    this.authStatusSub!.unsubscribe();
  }

}

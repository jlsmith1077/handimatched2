import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './authentication/auth-interceptor';
import { ErrorInterceptor } from './authentication/error-interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { ProfileListComponent } from './profile-list/profile-list.component';
import { ProfileService } from './profile.service';
import { RecordVideoService } from './profile-edit/media-folder/record-video/record-video.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorComponent } from './authentication/error/error.component';
import { GoogleLoginComponent } from './authentication/google-login/google-login.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { GodaddyComponent } from './godaddy/godaddy.component';
import { ProfileItemComponent } from './profile-list/profile-item/profile-item.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { LikeComponent } from './like/like.component';
import { MessageboardComponent } from './messageboard/messageboard.component';
import { CommentsComponent } from './messageboard/comments/comments.component';
import { CommentsListComponent } from './messageboard/comments/comments-list/comments-list.component';
import { MyProfileComponent } from './profile-list/my-profile/my-profile.component';
import { MessageComponent } from './message/message.component';
import { PostCreateComponent } from './messageboard/post-create/post-create.component';
import { SettingsComponent } from './settings/settings.component';
import { MessageListComponent } from './message/message-list/message-list.component';
import { AddImagesComponent } from './profile-edit/media-folder/add-images/add-images.component';
import { RecordVideoComponent } from './profile-edit/media-folder/record-video/record-video.component';
import { YourgalleryComponent } from './profile-edit/yourgallery/yourgallery.component';
import { CheckFileExtensionDirective } from './check-file-extension.directive';
import { VideoChatComponent } from './video-chat/video-chat.component';


@NgModule({
  declarations: [
    AppComponent,
    ProfileListComponent,
    ErrorComponent,
    GoogleLoginComponent,
    SigninComponent,
    SignupComponent,
    GodaddyComponent,
    ProfileItemComponent,
    ProfileEditComponent,
    LikeComponent,
    MessageboardComponent,
    CommentsComponent,
    CommentsListComponent,
    MyProfileComponent,
    MessageComponent,
    PostCreateComponent,
    SettingsComponent,
    MessageListComponent,
    AddImagesComponent,
    RecordVideoComponent,
    YourgalleryComponent,
    CheckFileExtensionDirective,
    VideoChatComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    SocialLoginModule,
    MatDividerModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '383361761536-5p1q1glfu3ni8cv0akaifmgh5gdvbbk4.apps.googleusercontent.com'
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
    ProfileService,
    RecordVideoService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }

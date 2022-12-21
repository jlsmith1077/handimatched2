import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { HomeComponent } from './home/home.component';
import { ProfileListComponent } from './profile-list/profile-list.component'
import { GoogleLoginComponent } from './authentication/google-login/google-login.component';
import { GodaddyComponent  } from './godaddy/godaddy.component';
import { AuthGuard } from './authentication/auth-guard';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ProfileDetailComponent } from './profile-edit/profile-detail/profile-detail.component';
import { MessageboardComponent } from './messageboard/messageboard.component';
import { PostCreateComponent } from './messageboard/post-create/post-create.component';
import { SettingsComponent } from './settings/settings.component';


const routes: Routes = [
  { path: 'app', redirectTo: '', pathMatch: 'full' },
  {path: 'profiles', component: ProfileListComponent, children: [
    { path: 'create1', component: ProfileEditComponent},
    { path: 'edit/:id', component: ProfileEditComponent },
    { path: ':id', component: ProfileDetailComponent },
  ]},
  { path: 'signup', component: SignupComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'messageboard', component: MessageboardComponent},
  { path: 'mail', component: ProfileEditComponent, canActivate: [AuthGuard] },
  { path: 'create', component: PostCreateComponent },
  { path: 'edit/:id', component: PostCreateComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'settings/:id', component: SettingsComponent },
  {path: 'google', component: GoogleLoginComponent, canActivate: [AuthGuard] },  
  {path: '.well-known/pki-validation/godaddy.html', component: GodaddyComponent},  
  { path: '**', component: ProfileListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

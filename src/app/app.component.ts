import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { map, Observable, shareReplay, Subscription } from 'rxjs';

import { Profile } from './profile.model';
import { User } from './authentication/user.model';
import { AuthService } from './authentication/auth.service';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  profileUser: string = '';
  mode: string = 'create';
  user: any = User;
  profile: any = Profile;
  private authListenerSubs: Subscription = new Subscription;
  private userMode: Subscription = new Subscription;
  title = 'handimatched2';isLoading: Boolean = false;
  userIsAuthenticated = false;
  logOut: boolean = true;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile: number;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
 .pipe(
   map(result => result.matches),
   shareReplay()
 );

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private profileService: ProfileService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher,
              private breakpointObserver: BreakpointObserver,
              ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.isMobile = window.innerWidth;    
   }

  ngOnInit(): void {
    if(this.logOut) {
      this.authService.autoAuthUser();
    }
    this.isMobile = window.innerWidth;
    if(this.isMobile < 601) {
      this.isHandset$
    }
    this.userMode = this.authService.getUserStatusListener().subscribe(responseData => {
        this.mode = responseData.mode;
        this.profile = responseData.profile;
        this.user = responseData.profile; 
    }); 
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.activatedRoute.fragment.subscribe((fragment: any) => { 
      if (fragment && document.getElementById(fragment) != null) {
        document.getElementById(fragment)!.scrollIntoView({ behavior: "smooth" });
      }
    });
//   this.mailservice.getMails();
//   this.mailSub = this.mailservice.getMailUpdateListener().subscribe((mailData: Mail[]) => {
//       this.mails = mailData;
//       const newMail = this.mails.filter(mail => mail.opened === 'false');
//       this.userOpenMailLength = newMail.length;
//   });
//   this.mailSub2 = this.mailservice.getIsOpenListner().subscribe(bool => {
//     this.isOpen = bool;
//   });
  
//   this.openStateSub = this.mailservice.getOpenedStateUpdateListener()
//   .subscribe((resData: string[]) => {
//     this.userOpenMail = resData;
// });
  }
  ngAfterInit() {
    this.breakpointObserver.observe(['(max-width: 600px)']).subscribe((res) => {
      if(res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
  removeDivider() {
    this.profileService.routerStatusListener.next(false);
  }
  onLogout() {
    this.authService.logout();
    this.logOut = false;
    this.profileService.routerStatusListener.next(false);
    }
    
ngOnDestroy(){
  this.authListenerSubs.unsubscribe();
  this.userMode.unsubscribe();
 }

}

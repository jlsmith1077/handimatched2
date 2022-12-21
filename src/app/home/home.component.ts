import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';

import { MatSidenav } from '@angular/material/sidenav';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title = 'handimatched2';isLoading: Boolean = false;
  userIsAuthenticated = false;
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

  constructor(
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
    if(this.isMobile < 601) {
      this.isHandset$
    }
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
}

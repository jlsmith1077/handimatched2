import { Component, OnInit, Input, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Profile } from '../../profile.model';
import { ProfileService } from '../../profile.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.css']
})
export class ProfileItemComponent implements OnInit {
  userPic: string = '';
  @Input()
  profile!: Profile;
  @Input()
  index!: number;
  @Input()
  userIsAuthenticated!: boolean;
  @Input()
  Id!: string;
  @Output() mode = new Subject<string>();
  @Input() profileusername = new Subject<string>();

  constructor(private profileservice: ProfileService,
              public location: Location
    ) { }

  ngOnInit(): void {
  }
  setDefaultPic() {
    this.userPic = '../../../assets/images/default_pic.jpg';
  }
  saveUsername(username: string, index: any) {
    this.location.path() + 'focusHere';
    const Id = this.profile.id;
    const receiver = this.profile.creator;
    sessionStorage.setItem('index', JSON.stringify(index));
    sessionStorage.setItem('receivername', username);
    sessionStorage.setItem('receiver', receiver);
    sessionStorage.removeItem('username1');
    this.profileusername.next(username);
    this.mode.next('login');
    this.profileservice.routerStatusListener.next(true);
  }

}

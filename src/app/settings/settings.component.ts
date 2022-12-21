import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MessagePostService } from '../messageboard/message-post.service';
import { ActivatedRoute, Router, Params, ParamMap } from '@angular/router';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit  {
private id: string = 'no id';
private setting: string = '';
settings: string[] = [
  'friends',
  'all',
  'only me'
]
  constructor(
      private messagePostService: MessagePostService,
      private route: ActivatedRoute,
      private router: Router
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has("id")) {
        this.id = paramMap.get('id') as string;        
      }
    });
  }
  ngAfterViewInit(): void {
    
  }
  setSetting(setting: string) {
    this.setting = setting; 
  }
  visibilityChange() {
    if(this.id != 'no id') {
      this.messagePostService.changeSettingsAllPosts(this.setting)
    } else {
      this.messagePostService.changeSettingsOnePost(this.id, this.setting);
    }
  }

}

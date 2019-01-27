import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';
import { SeoService } from '../../shared/services/seo.service';
import { CurrentUserService } from '../../shared/services/currentUser.service';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  providers: [MobileDetectionService, SeoService, CurrentUserService],
  // animations: [routerTransition()]
})
export class HelpComponent implements OnInit {

  public isMobile: boolean;
  constructor(private mobile: MobileDetectionService,
    private seo: SeoService,
    private userService: CurrentUserService,
  ) { }

  ngOnInit() {
    this.isMobile = this.mobile.isMobile();
    this.seo.generateTags({
      title: 'FAQ - SpurEd',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'FAQ-page'
    })
    this.userService.setTitle("FAQ - SpurEd")
  }

}

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from "primeng/components/common/messageservice";
import * as constant from "../../shared/others/constants";
import { CustomValidator } from "../../shared/others/custom.validator";
import { SeoService } from '../../shared/services';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { OthersProfileService } from './profile-other.service';
import { ToastrService } from '../../shared/services/Toastr.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'profile-other',
  templateUrl: './profile-other.component.html',
  styleUrls: ['./profile-other.component.css'],
  providers: [OthersProfileService, CustomValidator, MessageService, SeoService, CurrentUserService, ToastrService]
})
export class OthersProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute, private service: OthersProfileService, private seo:SeoService, private userService:CurrentUserService,
    private toastr:ToastrService, @Inject(PLATFORM_ID) private platformId: Object) { }

  public profileLoader = false;
  public urls: any = [];
  public userDetails: any;
  public currentUser:any;
  public profileImage: any = "assets/images/noticer_default_user_img.png";
  public profileAvailable = true;
  public validUser: boolean = false;
  ngOnInit() {
    this.seo.generateTags({
      title: 'SpurEd - Spur Encouragement to Education',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'feed-page'
    })
    this.userService.setTitle("SpurEd - Spur Encouragement to Education")
    this.route.params.subscribe(this.handleParams.bind(this));

    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.userService.getCurrentUser();
      if (this.currentUser) {
        this.validUser = true;
      }
    }
  }

  handleParams(params: any) {
    let userId = params['id'];
    this.loadProfileDetails(userId);
  }

  loadProfileDetails(userId) {
    console.log("get profile details");
    this.service.getUserInfo(userId).subscribe(resData => {
      if(resData == null){
        this.profileAvailable = false;
        return;
      }
      this.userDetails = resData;
      this.userService.setTitle(this.userDetails.userName + " - SpurEd");
      if (this.userDetails && this.userDetails.profileImageUrl) {
        this.profileImage = this.userDetails.profileImageUrl;
      } else{
        this.profileImage = "assets/images/noticer_default_user_img.png";
      }
    })
  }
  
imageFromAws(url){
  return url.indexOf("https://") != -1 ? true : false;
}
}

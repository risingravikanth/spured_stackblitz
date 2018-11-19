import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from "primeng/components/common/messageservice";
import { routerTransition } from "../../router.animations";
import { CustomValidator } from "../../shared/others/custom.validator";
import { OthersProfileService } from './profile-other.service';
import * as constant from "../../shared/others/constants"
import { SeoService } from '../../shared/services';
import { CurrentUserService } from '../../shared/services/currentUser.service';

@Component({
  selector: 'profile-other',
  templateUrl: './profile-other.component.html',
  styleUrls: ['./profile-other.component.css'],
  providers: [OthersProfileService, CustomValidator, MessageService, SeoService, CurrentUserService],
  // animations: [routerTransition()]
})
export class OthersProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute, private service: OthersProfileService, private seo:SeoService, private userService:CurrentUserService) { }

  public profileLoader = false;
  public urls: any = [];
  public userDetails: any;
  public profileImage: any = "assets/images/noticer_default_user_img.png";
  ngOnInit() {
    this.seo.generateTags({
      title: 'Other Profile',
      description: 'Others profile page', 
      slug: 'others profile'
  })
  this.userService.setTitle("Noticer | Others profile");
    this.route.params.subscribe(this.handleParams.bind(this));
  }

  handleParams(params: any) {
    let userId = params['id'];
    this.loadProfileDetails(userId);
  }

  loadProfileDetails(userId) {
    console.log("get profile details");
    this.service.getUserInfo(userId).subscribe(resData => {
      this.userDetails = resData;
      this.userService.setTitle("Noticer | "+this.userDetails.userName);
      if (this.userDetails && this.userDetails.profileImageUrl) {
        this.profileImage = constant.REST_API_URL + "/" +this.userDetails.profileImageUrl;
      } else{
        this.profileImage = "assets/images/noticer_default_user_img.png";
      }
    })
  }
}

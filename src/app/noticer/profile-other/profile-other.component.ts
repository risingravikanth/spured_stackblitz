import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from "primeng/components/common/messageservice";
import * as constant from "../../shared/others/constants";
import { CustomValidator } from "../../shared/others/custom.validator";
import { SeoService } from '../../shared/services';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { OthersProfileService } from './profile-other.service';
import { ToastrService } from '../../shared/services/Toastr.service';

@Component({
  selector: 'profile-other',
  templateUrl: './profile-other.component.html',
  styleUrls: ['./profile-other.component.css'],
  providers: [OthersProfileService, CustomValidator, MessageService, SeoService, CurrentUserService, ToastrService]
})
export class OthersProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute, private service: OthersProfileService, private seo:SeoService, private userService:CurrentUserService,
    private toastr:ToastrService) { }

  public profileLoader = false;
  public urls: any = [];
  public userDetails: any;
  public profileImage: any = "assets/images/noticer_default_user_img.png";
  public profileAvailable = true;
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
      if(resData == null){
        this.profileAvailable = false;
        return;
      }
      this.userDetails = resData;
      this.userService.setTitle("Noticer | "+this.userDetails.userName);
      if (this.userDetails && this.userDetails.profileImageUrl) {
        this.profileImage = (this.imageFromAws(this.userDetails.profileImageUrl) ? '' : (constant.REST_API_URL + "/")) +  this.userDetails.profileImageUrl;
      } else{
        this.profileImage = "assets/images/noticer_default_user_img.png";
      }
    })
  }
  
imageFromAws(url){
  return url.indexOf("https://") != -1 ? true : false;
}
}

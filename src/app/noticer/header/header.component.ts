import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as constant from '../../shared/others/constants'
import { SettingsService } from '../settings/settings.service';
import { AuthService } from '../../shared/services/auth.service';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { CommonService } from '../../shared/services/common.service';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';
import { User } from '../../shared/models/user.model';
import { CreatePostComponent } from '../noticer-main/create-post/create-post.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers:[SettingsService]
})
export class HeaderComponent implements OnInit {

    pushRightClass: string = 'push-right';
    toggleTopicsMenu: any = false;

    public headerValue = "header";

    public responseVo: any = { info: null, source: null, statusCode: null };
    getAllRequestsList:any = [];
    showNotifications: boolean = false;
    notificationsCount:any;

    constructor(public router: Router, private authService: AuthService,
        private userService: CurrentUserService,
        private settingsService:SettingsService,
        private commonService: CommonService, private mobileService: MobileDetectionService) { }

    currentUser: User;
    public isMobile: boolean;
    public profileImage:any;
    public validUser: boolean = false;

    ngOnInit() {
        this.currentUser = this.userService.getCurrentUser();
        if(this.currentUser){
            this.validUser = true;
        }
        if(this.currentUser && this.currentUser.imageUrl){
            this.profileImage = constant.REST_API_URL + "/" + this.currentUser.imageUrl;
        } else{
            this.profileImage = "assets/images/noticer_default_user_img.png"
        }
        this.isMobile = this.mobileService.isMobile();
        if(!this.isMobile){
            this.boardRequests();
        }
        this.commonService.menuChanges.subscribe(resData =>{
            if(resData == "updateProfilePic"){
                this.currentUser = this.userService.getCurrentUser();
                if(this.currentUser && this.currentUser.imageUrl){
                    this.profileImage = constant.REST_API_URL + "/" + this.currentUser.imageUrl;
                }       
            }
        })
    }

    addPost(){
        // this.commonService.updateHeaderMenu("openAddPostDialog");
    }

    goToUserProfile() {
        this.router.navigate(['profile/self']);
    }

    toggleTopics() {
        this.router.navigate(['noticer/mobile-menu']);
    }

    onLoggedout() {
        // this.authService.attemptLogout(this.authService.getCurrentUser()).subscribe(resData => {
        //     this.responseVo = resData;
        //     if (this.responseVo.statusCode == 'SUCCESS') {
                console.log("logged out successfully");
                this.authService.purgeAuth();
                this.router.navigate(["/login"])
        //     } else {
        //         alert("failed");
        //     }
        // });
    }

    boardRequests() {
        this.settingsService.getAllRequests().subscribe(
          resData => {
            this.getAllRequestsList = resData;
            if (this.getAllRequestsList && this.getAllRequestsList.code == "ERROR") {
              alert(this.getAllRequestsList.info);
              this.showNotifications = false;
            } else if (this.getAllRequestsList && this.getAllRequestsList.requests && this.getAllRequestsList.requests.length > 0) {
                this.notificationsCount = this.getAllRequestsList.requests.length;
              this.showNotifications = true;
            } else {
              this.showNotifications = false;
            }
          }
        )
      }

      @ViewChild(CreatePostComponent)
     private myChild: CreatePostComponent;

   openTab(){		
		this.myChild.open();	   
   }
}

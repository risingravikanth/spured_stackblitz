import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { CurrentUserService } from '../../services/currentUser.service';

import { CommonService } from "../../services/common.service";
import { MobileDetectionService } from '../../services/mobiledetection.service';
import * as constant from '../../others/constants'
import { SettingsService } from '../../../noticer/settings/settings.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers:[SettingsService]
})
export class HeaderComponent implements OnInit {

    pushRightClass: string = 'push-right';
    toggleTopicsMenu: any = false;

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
        this.boardRequests();
        this.commonService.menuChanges.subscribe(resData =>{
            if(resData == "updateProfilePic"){
                this.currentUser = this.userService.getCurrentUser();
                if(this.currentUser && this.currentUser.imageUrl){
                    this.profileImage = constant.REST_API_URL + "/" + this.currentUser.imageUrl;
                }       
            }
        })
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
            } else if (this.getAllRequestsList && this.getAllRequestsList.length > 0) {
                this.notificationsCount = this.getAllRequestsList.length;
              this.showNotifications = true;
            } else {
              this.showNotifications = false;
            }
          }
        )
      }
}

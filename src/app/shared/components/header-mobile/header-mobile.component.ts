import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { CurrentUserService } from '../../services/currentUser.service';

import { CommonService } from "../../services/common.service";
import { MobileDetectionService } from '../../services/mobiledetection.service';
import * as constant from '../../others/constants'
import { SettingsService } from '../../../noticer/settings/settings.service';

@Component({
    selector: 'header-mobile',
    templateUrl: './header-mobile.component.html',
    styleUrls: ['./header-mobile.component.scss'],
    providers:[SettingsService]
})
export class HeaderMobileComponent implements OnInit {

    public responseVo: any = { info: null, source: null, statusCode: null };

    constructor(public router: Router, private authService: AuthService,
        private userService: CurrentUserService,
        private commonService: CommonService, private mobileService: MobileDetectionService,
        private settingsService:SettingsService) { }

    currentUser: User;
    public isMobile: boolean;
    public showMenu:boolean = true;
    public profileImage:any;
    public validUser:boolean = false;
    public showSideMenuDialog: boolean = false;
    getAllRequestsList:any = [];
    showNotifications: boolean = false;
    notificationsCount:any;
    ngOnInit() {
        this.isMobile = this.mobileService.isMobile();

        this.currentUser = this.userService.getCurrentUser();
        if(this.currentUser){
            this.validUser = true;
        }
        if(this.currentUser && this.currentUser.imageUrl){
            this.profileImage = constant.REST_API_URL + "/" + this.currentUser.imageUrl;
        } else{
            this.profileImage = "assets/images/noticer_default_user_img.png"
        }
        if(this.isMobile){
            this.boardRequests();
        }

        this.commonService.menuChanges.subscribe(item =>{
            if(item == "noticer"){
                this.showMenu = true;
            } else if(item == "updateProfilePic"){
                this.currentUser = this.userService.getCurrentUser();
                if(this.currentUser && this.currentUser.imageUrl){
                    this.profileImage = constant.REST_API_URL + "/" + this.currentUser.imageUrl;
                }       
            } else if (item == "sideMenuOpen") {
                this.showSideMenuDialog = true;
              } else if (item == "sideMenuClose") {
                this.showSideMenuDialog = false;
              }
        })
    }

    goToUserProfile() {
        this.router.navigate(['profile/self']);
    }

    toggleTopics() {
        this.showMenu = false;
        this.router.navigate(['feed/mobile-menu']);
    }
    hideMenu(){
        this.showMenu = true;
        // this.router.navigate(["/feed"])
    }

    addPost(){
        this.commonService.updateHeaderMenu("openAddPostDialog");
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


    sideMenuOpen(){
        // this.commonService.updateHeaderMenu("sideMenuOpen");
        this.showSideMenuDialog = true;
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

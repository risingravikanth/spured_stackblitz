import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { CurrentUserService } from '../../services/currentUser.service';

import { CommonService } from "../../services/common.service";
import { MobileDetectionService } from '../../services/mobiledetection.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    pushRightClass: string = 'push-right';
    toggleTopicsMenu: any = false;

    public responseVo: any = { info: null, source: null, statusCode: null };

    constructor(public router: Router, private authService: AuthService,
        private userService: CurrentUserService,
        private commonService: CommonService, private mobileService: MobileDetectionService) { }

    currentUser: User;
    public isMobile: boolean;
    public profileImage:any;

    ngOnInit() {
        this.currentUser = this.userService.getCurrentUser();
        if(this.currentUser && this.currentUser.profileImageUrl){
            this.profileImage = this.currentUser.profileImageUrl;
        } else{
            this.profileImage = "assets/images/noticer_default_user_img.png"
        }
        this.isMobile = this.mobileService.isMobile();
    }

    goToUserProfile() {
        this.router.navigate(['noticer/user-profile']);
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
}

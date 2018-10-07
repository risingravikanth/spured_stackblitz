import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { CurrentUserService } from '../../services/currentUser.service';

import { CommonService } from "../../services/common.service";
import { MobileDetectionService } from '../../services/mobiledetection.service';

@Component({
    selector: 'header-mobile',
    templateUrl: './header-mobile.component.html',
    styleUrls: ['./header-mobile.component.scss']
})
export class HeaderMobileComponent implements OnInit {

    public responseVo: any = { info: null, source: null, statusCode: null };

    constructor(public router: Router, private authService: AuthService,
        private userService: CurrentUserService,
        private commonService: CommonService, private mobileService: MobileDetectionService) { }

    currentUser: User;
    public isMobile: boolean;
    public showMenu:boolean = true;

    ngOnInit() {
        this.isMobile = this.mobileService.isMobile();
        this.commonService.menuChanges.subscribe(item =>{
            if(item == "noticer"){
                this.hideMenu();
            }
        })
    }

    goToUserProfile() {
        this.router.navigate(['noticer/user-profile']);
    }

    toggleTopics() {
        this.showMenu = false;
        this.router.navigate(['noticer/mobile-menu']);
    }
    hideMenu(){
        this.showMenu = true;
        this.router.navigate(["/noticer"])
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

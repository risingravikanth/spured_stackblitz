import { Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { AuthenticationService } from '../../shared/services/auth.service';
import { CommonService } from '../../shared/services/common.service';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';
import { CreatePostComponent } from '../core-main/create-post/create-post.component';
import { NotificationsService } from '../notifications/notifications.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [NotificationsService]
})
export class HeaderComponent implements OnInit {

    pushRightClass: string = 'push-right';
    toggleTopicsMenu: any = false;

    public headerValue = "header";
    public notificationsCount: any;

    public responseVo: any = { info: null, source: null, statusCode: null };
    notificationsList: any = [];
    showNotifications: boolean = false;

    notificationDetails: any;

    constructor(public router: Router, private authService: AuthenticationService,
        private userService: CurrentUserService,
        private notifyService: NotificationsService,
        private commonService: CommonService, 
        private mobileService: MobileDetectionService,
        @Inject(PLATFORM_ID) private platformId: Object) { }

    currentUser: User;
    isAdmin: boolean = false;
    public isMobile: boolean;
    public profileImage: any;
    public validUser: boolean = false;

    @ViewChild(CreatePostComponent)
    private myChild: CreatePostComponent;

    ngOnInit() {
        this.currentUser = this.userService.getCurrentUser();
        this.isAdmin = this.userService.isCurrentUserAdmin();
        if (this.currentUser && this.authService.isTokenValid()) {
            this.validUser = true;
        }
        if (this.currentUser && this.currentUser.imageUrl) {
            this.profileImage = this.currentUser.imageUrl;
        } else {
            this.profileImage = "assets/images/noticer_default_user_img.png"
        }
        this.isMobile = this.mobileService.isMobile();
        this.commonService.menuChanges.subscribe((resData: any) => {
            if (resData == "updateProfilePic") {
                this.currentUser = this.userService.getCurrentUser();
                if (this.currentUser && this.currentUser.imageUrl) {
                    this.profileImage = this.currentUser.imageUrl;
                }
            } else if (resData && resData.type == "updateNoficiationCount") {
                if (resData.count > 0) {
                    this.notificationsCount = resData.count;
                    this.showNotifications = true;
                }
            }
        })
    }

    addPost() {
        this.myChild.open();
    }

    goToUserProfile() {
        this.router.navigate(['profile/self']);
    }

    toggleTopics() {
        this.router.navigate(['noticer/mobile-menu']);
    }

    onLoggedout() {
        console.log("logged out successfully");
        this.authService.purgeAuth();
        if (isPlatformBrowser(this.platformId)) {
            window.open('/home', "_self")
        }
    }



    imageFromAws(url) {
        return url.indexOf("https://") != -1 ? true : false;
    }

    updateLastRead() {
        if (this.notificationsCount > 0) {
            this.notificationsCount = 0;
            this.showNotifications = false;
            this.commonService.updateHeaderMenu({ type: "updateLastRead" })
        }
    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import * as constant from '../../shared/others/constants';
import { AuthService } from '../../shared/services/auth.service';
import { CommonService } from '../../shared/services/common.service';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';
import { CreatePostComponent } from '../noticer-main/create-post/create-post.component';
import { SettingsService } from '../settings/settings.service';
import { NotificationsService } from '../notifications/notifications.service';

@Component({
    selector: 'header-mobile',
    templateUrl: './header-mobile.component.html',
    styleUrls: ['./header-mobile.component.scss'],
    providers: [NotificationsService]
})
export class HeaderMobileComponent implements OnInit {

    public headerValue = "header";
    public notificationCount = 10;

    public responseVo: any = { info: null, source: null, statusCode: null };

    constructor(public router: Router, private authService: AuthService,
        private userService: CurrentUserService,
        private commonService: CommonService, 
        private mobileService: MobileDetectionService,
        private notifyService: NotificationsService,) { }

    currentUser: User;
    public isMobile: boolean;
    public showMenu: boolean = true;
    public profileImage: any;
    public validUser: boolean = false;
    public showSideMenuDialog: boolean = false;
    getAllRequestsList: any = [];
    showNotifications: boolean = false;
    notificationsCount: any;
    @ViewChild(CreatePostComponent)
    private myChild: CreatePostComponent;
    ngOnInit() {
        this.isMobile = this.mobileService.isMobile();

        this.currentUser = this.userService.getCurrentUser();
        if (this.currentUser) {
            this.validUser = true;
        }
        if (this.currentUser && this.currentUser.imageUrl) {
            this.profileImage = constant.REST_API_URL + "/" + this.currentUser.imageUrl;
        } else {
            this.profileImage = "assets/images/noticer_default_user_img.png"
        }
        if (this.isMobile && this.validUser) {
            this.getAllNotifications();
        }

        this.commonService.menuChanges.subscribe(item => {
            if (item == "updateProfilePic") {
                this.currentUser = this.userService.getCurrentUser();
                if (this.currentUser && this.currentUser.imageUrl) {
                    this.profileImage = constant.REST_API_URL + "/" + this.currentUser.imageUrl;
                }
            }
        })
    }

    sideMenuOpen(){
        this.showSideMenuDialog = true;
    }

    goToUserProfile() {
        this.router.navigate(['profile/self']);
    }

    addPost() {
        this.myChild.open();
    }

    onLoggedout() {
        console.log("logged out successfully");
        this.authService.purgeAuth();
        this.router.navigate(["/login"])
    }

    getAllNotifications() {
        let body = {
            "data": {
                "_type": "Message",
                "messageType": "NOTIFICATION"
            },
            "pagination": {
                "limit": 10,
                "offset": 0
            }
        }
        this.notifyService.getAllMessages(body).subscribe((resData: any) => {
            if (resData && resData.code == "ERROR") {
                alert(resData.info);
                this.showNotifications = false;
            } else if (resData && resData.unreadCount > 0) {
                this.showNotifications = true;
                this.notificationsCount = resData.unreadCount;
            }
        })
    }
}

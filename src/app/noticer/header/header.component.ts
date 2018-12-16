import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import * as constant from '../../shared/others/constants';
import { AuthService } from '../../shared/services/auth.service';
import { CommonService } from '../../shared/services/common.service';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';
import { CreatePostComponent } from '../noticer-main/create-post/create-post.component';
import { NotificationsService } from '../notifications/notifications.service';

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

    constructor(public router: Router, private authService: AuthService,
        private userService: CurrentUserService,
        private notifyService: NotificationsService,
        private commonService: CommonService, private mobileService: MobileDetectionService) { }

    currentUser: User;
    public isMobile: boolean;
    public profileImage: any;
    public validUser: boolean = false;

    @ViewChild(CreatePostComponent)
    private myChild: CreatePostComponent;

    ngOnInit() {
        this.currentUser = this.userService.getCurrentUser();
        if (this.currentUser) {
            this.validUser = true;
        }
        if (this.currentUser && this.currentUser.imageUrl) {
            this.profileImage = (this.imageFromAws(this.currentUser.imageUrl) ? '' : (constant.REST_API_URL + "/")) + this.currentUser.imageUrl;
        } else {
            this.profileImage = "assets/images/noticer_default_user_img.png"
        }
        this.isMobile = this.mobileService.isMobile();
        this.commonService.menuChanges.subscribe((resData:any) => {
            if (resData == "updateProfilePic") {
                this.currentUser = this.userService.getCurrentUser();
                if (this.currentUser && this.currentUser.imageUrl) {
                    this.profileImage = (this.imageFromAws(this.currentUser.imageUrl) ? '' : (constant.REST_API_URL + "/")) + this.currentUser.imageUrl;
                }
            } else if (resData && resData.type == "updateNoficiationCount"){
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
        this.router.navigate(["/login"])

    }



    imageFromAws(url){
        return url.indexOf("https://") != -1 ? true : false;
      }
}

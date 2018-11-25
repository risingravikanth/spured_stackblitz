import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MobileDetectionService, CommonService } from './shared';
import { Title } from '@angular/platform-browser';
import { SelfProfileService } from './noticer/profile-self/profile-self.service';
import { CurrentUserService } from './shared/services/currentUser.service';
import { User } from './shared/models/user.model';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers:[SelfProfileService, CurrentUserService]
})
export class AppComponent implements OnInit {
    public isMobile: boolean;
    constructor(private mobileService: MobileDetectionService, private titleService: Title, private profileService: SelfProfileService, private userService: CurrentUserService,
        private commonService:CommonService) { }

    ngOnInit(): void {
        this.isMobile = this.mobileService.isMobile();
        this.updateProfilePicInLocal();
    }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }

    updateProfilePicInLocal() {

        let user: User = this.userService.getCurrentUser();
        if(user){
            this.profileService.getUserInfo(user.userId).subscribe(
                (resData: any) => {
                    if(resData){
                        user.imageUrl = resData.profileImageUrl;
                        this.userService.setCurrentUser(user);
                        this.commonService.updateHeaderMenu("updateProfilePic");
                    }
                }
            )
        }
    }
}

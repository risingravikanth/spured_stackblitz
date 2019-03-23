import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MobileDetectionService, CommonService } from './shared';
import { Title, makeStateKey, TransferState } from '@angular/platform-browser';
import { SelfProfileService } from './spured/profile-self/profile-self.service';
import { CurrentUserService } from './shared/services/currentUser.service';
import { User } from './shared/models/user.model';
import { JwtService } from './shared/services/jwt.service';
const MY_DATA = makeStateKey('ACCOUNT_ACTIVATION');

declare var lightbox: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [SelfProfileService, CurrentUserService, JwtService]
})
export class AppComponent implements OnInit {
    public isMobile: boolean;
    constructor(private mobileService: MobileDetectionService, private titleService: Title, private profileService: SelfProfileService, private userService: CurrentUserService,
        private commonService: CommonService, private jwtService: JwtService,
        private state: TransferState) { }

    ngOnInit(): void {
        this.isMobile = this.mobileService.isMobile();
        //this.isTokenValid();
        this.lightboxOptions();
    }

    public setTitle(newTitle: string) {
        this.titleService.setTitle(newTitle);
    }

    updateProfilePicInLocal() {

        let user: User = this.userService.getCurrentUser();
        if (user) {
            this.profileService.getUserInfo(user.userId).subscribe(
                (resData: any) => {
                    if (resData) {
                        user.imageUrl = resData.profileImageUrl;
                        this.userService.setCurrentUser(user);
                        this.commonService.updateHeaderMenu("updateProfilePic");
                    }
                }
            )
        }
    }

    isTokenValid() {
        // const store = this.state.get(MY_DATA, null);
        // if (store) {
        //     this.tokenValid(store);
        //     return;
        // }
        this.profileService.isValidToken().subscribe((resData: any) => {
            this.state.set(MY_DATA, resData);
            this.tokenValid(resData);

        })
    }

    tokenValid(resData) {
        if (!resData.valid) {
            this.jwtService.destroyToken();
            this.userService.deleteCurrentUser();
        }
        this.updateProfilePicInLocal();
    }

    lightboxOptions() {
        // lightbox.option({
        //     'disableScrolling': true,
        //     'resizeDuration': 200,
        //     'wrapAround': true
        // })
    }
}

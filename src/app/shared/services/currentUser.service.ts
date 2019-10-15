import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { User } from '../models/user.model';
import { JwtService } from './jwt.service';
import { CookiesService } from '@ngx-utils/cookies';

@Injectable()
export class CurrentUserService {

    constructor(private jwtService: JwtService, 
                @Inject(PLATFORM_ID) private platformId: Object,
                private titleService: Title,
                private injector: Injector,
                private cookies: CookiesService
                ) { }
    setCurrentUser(user: User) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
    }
    getCurrentUser(): User {
        if (isPlatformBrowser(this.platformId)) {
            let currentUser: User;
            currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return currentUser;
        } 
    }
    isCurrentUserAdmin(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            let currentUser: User;
            currentUser = JSON.parse(localStorage.getItem('currentUser'));
            return (currentUser && (currentUser.accountType == 'ADMIN' || currentUser.accountType == 'ADMIN_GLOBAL')) ? true : false;
        } 
    }

    checkLoggedInUser(): any {
        if (isPlatformBrowser(this.platformId)) {
            if(this.getCurrentUser()
            //  && this.isTokenValid()
            ){
                 return true;
            }else{
                return false;
            }
           
        }else{
            const reqObj: any = this.injector.get('REQUEST');
            const rawCookies = !!reqObj.headers['cookie'] ? reqObj.headers['cookie'] : '';
            if(rawCookies != ''){
                return true;
            }else{
                return false;
            }
        }
    }


    deleteCurrentUser() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('currentUser');
        }
    }

    purgeAuth() {
        this.jwtService.destroyToken();
        this.deleteCurrentUser();
        this.removeCookie("Authorization");
        this.removeCookie("user_id");
        this.removeCookie("isLoggedInUser");
    }

    checkValidUser(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.getCurrentUser() && this.getCurrentUser().token && this.isTokenValid()) {
                return true;
            } else {
                return false;
            }
        }
    }

    isTokenValid() {
        let user : User = this.getCurrentUser();
        if (user) {
            let diff = new Date().getTime() - user.expiration;
            if(diff <= 8.64e+7){
                return true;
            } else {
                this.purgeAuth();
                return false;
            }
        }
        return false;
    }

    public setTitle( newTitle: string) {
        this.titleService.setTitle( newTitle );
      }

      removeCookie(Key: any) {
        this.cookies.remove(Key);
    }
}
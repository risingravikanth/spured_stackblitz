import { JwtService } from './jwt.service';
import {  Injectable, Injector, PLATFORM_ID ,Inject } from '@angular/core';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Injectable()
export class CurrentUserService {

    constructor(private jwtService: JwtService, 
                @Inject(PLATFORM_ID) private platformId: Object,
                private titleService: Title,
                private injector: Injector) { }
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

    checkLoggedInUser(): any {
        if (isPlatformBrowser(this.platformId)) {
            let currentUser: User;
            currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if(currentUser != undefined && currentUser != null){
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
    checkValidUser(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.getCurrentUser() && this.getCurrentUser().token) {
                return true;
            } else {
                return false;
            }
        }
    }

    public setTitle( newTitle: string) {
        this.titleService.setTitle( newTitle );
      }
}
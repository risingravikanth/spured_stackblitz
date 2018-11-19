import { JwtService } from './jwt.service';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Injectable()
export class CurrentUserService {

    constructor(private jwtService: JwtService, @Inject(PLATFORM_ID) private platformId: Object, private titleService: Title) { }
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
    deleteCurrentUser() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('currentUser');
        }
    }
    checkValidUser(): boolean {
        if (isPlatformBrowser(this.platformId)) {
            if (this.getCurrentUser() && this.getCurrentUser().token) {
                console.log("valid user - service" )
                return true;
            } else {
                console.log("invalid user - service")
                console.log(this.getCurrentUser())
                return false;
            }
        }
    }

    public setTitle( newTitle: string) {
        this.titleService.setTitle( newTitle );
      }
}
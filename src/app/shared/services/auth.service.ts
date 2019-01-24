import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import 'rxjs/add/operator/distinctUntilChanged';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { CurrentUserService } from './currentUser.service';
// import { NgxPermissionsService } from 'ngx-permissions';
import * as constants from '../others/constants';
import { TransferState, makeStateKey } from '@angular/platform-browser';

import { CookiesService } from '@ngx-utils/cookies';

@Injectable()
export class AuthService {
    loggedUser: any;
    constructor(
        public router: Router,
        private http: HttpClient,
        private jwtService: JwtService,
        private currentUserService: CurrentUserService,
        private state:TransferState,
        private cookies: CookiesService
    ) { }

    setAuth(user: User) {
        this.jwtService.saveToken(user.token);
        
        /*this.setCookie('ravi_kanth','ravikanth');
        this.setCookie("ravi_kanth1",user.token);
        console.log(user.token);
        console.log(JSON.stringify(user.token))
        this.setCookie("ravi_kanth5",JSON.stringify(user.token));
        console.log(user.token.toString());*/

        this.setCookie("Authorization",user.token.toString());
        this.setCookie("user_id",user.userId.toString());
        this.setCookie("isLoggedInUser","true");

        this.currentUserService.setCurrentUser(user);
    }

    setCookie(key :string, value : string){
         this.cookies.put(key, value);
    }

    getCookie(key :any){
         return this.cookies.get(key)
    }

    removeCookie(Key :any){
        this.cookies.remove(Key);
    }

    removeAll(){
        this.cookies.removeAll();
    }

    getAuth(key :any){
         return this.cookies.get(key)
    }

    purgeAuth() {
        this.jwtService.destroyToken();
        this.currentUserService.deleteCurrentUser();
        this.removeCookie("Authorization");
        this.removeCookie("user_id");
        this.removeCookie("isLoggedInUser");
    }

    getCurrentUser(): User {
        return this.currentUserService.getCurrentUser();
    }

    attemptAuth(credentials: any, returnUrl: string) {
        let url: string;
        if (constants.isLive) {
            //calling node server
            url = "/authentication";
        } else {
            url = "/profile/login";
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.http.post(url, credentials, { headers: headers, responseType: 'text', observe: 'response' });
        // return this.http.get('/user/getlist',{responseType: 'text', observe: 'response'});
    }
    attemptLogout(body: any) {
        let url: string;
        if (constants.isLive) {
            //calling node server
            url = "/logout";
        } else {
            let url = "/profile/logout";
        }
        return this.http.post(url, null);
    }

    activateUserThroughUrl(code: any) {
        let url = "/profile/activate/" + code;
        const myData = this.http.get(url);
        return myData;
    }
}
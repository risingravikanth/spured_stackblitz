import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import 'rxjs/add/operator/distinctUntilChanged';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { CurrentUserService } from './currentUser.service';
// import { NgxPermissionsService } from 'ngx-permissions';
import * as constants from '../others/constants';

@Injectable()

export class AuthService {
    loggedUser: any;
    constructor(
        public router: Router,
        private http: HttpClient,
        private jwtService: JwtService,
        private currentUserService: CurrentUserService
    ) { }

    setAuth(user: User) {
        this.jwtService.saveToken(user.token);
        this.currentUserService.setCurrentUser(user);
    }
    purgeAuth() {
        this.jwtService.destroyToken();
        this.currentUserService.deleteCurrentUser();
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
}
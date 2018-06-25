import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import 'rxjs/add/operator/distinctUntilChanged';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';
import { CurrentUserService } from './currentUser.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable()

export class AuthService {

    constructor(
        public router: Router,
        private http: HttpClient,
        private jwtService: JwtService,
        private currentUserService: CurrentUserService,
        private permissionService: NgxPermissionsService
    ) { }

    setAuth(user: User) {
        this.jwtService.saveToken(user.token);
        this.currentUserService.setCurrentUser(user);
        this.currentUserService.setRole(user.role);
    }
    purgeAuth() {
        this.jwtService.destroyToken();
        this.currentUserService.deleteCurrentUser();
        this.currentUserService.deleteRole();
        this.permissionService.flushPermissions();
    }
    getCurrentUser(): User {
        return this.currentUserService.getCurrentUser();
    }
    loggedUser: any;
    attemptAuth(credentials: any, returnUrl: string) {
        let url = "/api/authenticate";
        let data: any;
        let headers = new HttpHeaders().set("Credentials", btoa(credentials.username + ":" + credentials.password));
        return this.http.post(url, data, { headers: headers, responseType: 'text', observe: 'response' });
    }
    attemptLogout(body: any) {
        let url =  "/api/authenticate/logout";
        return this.http.post(url, body);
    }
}
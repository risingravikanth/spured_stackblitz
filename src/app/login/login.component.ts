import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../router.animations';
import { User } from '../shared/models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CurrentUserService } from '../shared/services/currentUser.service';
import { AuthService } from '../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from '../shared/services/permission.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()],
    providers: [NgbAlertConfig]
})
export class LoginComponent implements OnInit {

    authForm: FormGroup;
    returnUrl: string;
    status: string = 'Login';
    disableLoginButton: boolean = false;
    loggedUser: any;
    errorTextMessage: string = '';
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private currentUser: CurrentUserService,
        private fb: FormBuilder,
        private permissionService: PermissionService,
        private per_service: NgxPermissionsService
    ) { }
    ngOnInit() {
        // if (this.currentUser.checkValidUser()) {
        //     this.router.navigate(['fms/main']);
        // }
        // let status = this.route.snapshot.queryParams['status'];
        // if (status) {
        //     this.errorTextMessage = 'Login Again !'
        // }
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/noticer/main';
        this.authForm = this.fb.group({
            username: ['', [
                Validators.required,
                Validators.email,
            ]],
            password: ['', Validators.required]
        });
    }
    onLoggedin() {
        // this.errorTextMessage = '';
        // if (this.authForm.valid) {
            // this.status = 'Just a moment ...';
            // this.disableLoginButton = true;
            this.router.navigate(['/noticer/main']);
            // this.authService.attemptAuth(this.authForm.value, this.returnUrl).subscribe(
            //     data => {
            //         this.loggedUser = JSON.parse(data.body);
            //         this.loggedUser.token = data.headers.get('Authorization');
            //         this.authService.setAuth(this.loggedUser);
            //         this.permissionService.getPermissions().subscribe(data => {
            //             let roleData: any = data;
            //             let authority: string[] = [];
            //             roleData.forEach(element => {
            //                 authority.push(element.authority);
            //             });
            //             this.per_service.loadPermissions(authority);
            //             this.router.navigate([this.returnUrl]);
            //         }, (err: HttpErrorResponse) => {
            //             console.log("permisssion error", err);
            //         })
            //     }, (err: HttpErrorResponse) => {
            //         // alert(err.error);
            //         let error: string = err.error;
            //         if (error.includes("AuthenticationException")) {
            //             this.errorTextMessage = 'Invalid email or password.';
            //         }
            //         this.status = 'Login';
            //         this.disableLoginButton = false;
            //     }
            // );
        // }
    }

}

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
// import { NgxPermissionsService } from 'ngx-permissions';

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
    status: string = 'Sign In';
    disableLoginButton: boolean = false;
    loggedUser: any;
    errorTextMessage: string = '';
    public responseVo:any = {info: null, source: null, statusCode: null};
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private currentUser: CurrentUserService,
        private fb: FormBuilder
    ) { }
    ngOnInit() {
        if (this.currentUser.checkValidUser()) {
            this.router.navigate(['/noticer']);
        }
        let status = this.route.snapshot.queryParams['status'];
        if (status) {
            this.errorTextMessage = 'Login Again !'
        }
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/noticer';
        this.authForm = this.fb.group({
            email: ['', [
                Validators.required,
                Validators.email,
            ]],
            password: ['', Validators.required]
        });
    }
    onLoggedin() {
        this.errorTextMessage = '';
        if (this.authForm.valid) {
            this.status = 'Just a moment ...';
            this.disableLoginButton = true;
            this.authService.attemptAuth(this.authForm.value, this.returnUrl).subscribe(
                resData => {
                    this.responseVo = JSON.parse(resData.body);
                    if(this.responseVo.statusCode == "ERROR"){
                        this.errorTextMessage = this.responseVo.info;
                    } else if(this.responseVo.token){
                        this.loggedUser = this.responseVo;
                        this.authService.setAuth(this.loggedUser);
                        this.router.navigate(['/noticer']);
                    }
                    else{
                        alert("Something went wrong");
                        this.errorTextMessage = "Something went wrong";
                    }
                }, (err: HttpErrorResponse) => {
                    this.status = 'Login';
                    this.disableLoginButton = false;
                }
            );
        }
    }

}

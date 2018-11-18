import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { routerTransition } from '../router.animations';
import { AuthService } from '../shared/services/auth.service';
import { CurrentUserService } from '../shared/services/currentUser.service';
import { SeoService, MobileDetectionService } from '../shared/services';
import { Message } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()],
    providers: [NgbAlertConfig, SeoService, MobileDetectionService, MessageService]
})
export class LoginComponent implements OnInit {

    authForm: FormGroup;
    returnUrl: string;
    status: string = 'Log in';
    disableLoginButton: boolean = false;
    loggedUser: any;
    errorTextMessage: string = '';
    public isMobile: boolean = false;
    public responseVo: any = { info: null, source: null, statusCode: null };
    msgs: Message[] = [];
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private currentUser: CurrentUserService,
        private fb: FormBuilder,
        private seo: SeoService,
        private mobile: MobileDetectionService,
        private messageService: MessageService
    ) { }
    ngOnInit() {
        this.isMobile = this.mobile.isMobile();
        this.seo.generateTags({
            title: 'Sign In',
            description: 'login through this awesome site',
            slug: 'signin-page'
        })
        if (this.currentUser.checkValidUser()) {
            // this.router.navigate(['/feed']);
            window.open('/feed', "_self")
        }
        let status = this.route.snapshot.queryParams['status'];
        if (status) {
            this.errorTextMessage = 'Login Again !'
        }
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/feed';
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
            this.status = 'Logging in, please wait...';
            this.disableLoginButton = true;
            this.authService.attemptAuth(this.authForm.value, this.returnUrl).subscribe(
                resData => {
                    this.responseVo = JSON.parse(resData.body);
                    if (this.responseVo.statusCode == "ERROR") {
                        this.errorTextMessage = this.responseVo.info;
                        this.status = 'Log in';
                    } else if (this.responseVo.token) {
                        this.loggedUser = this.responseVo;
                        this.authService.setAuth(this.loggedUser);
                        this.msgs = [];
                        this.messageService.add({ severity: 'error', summary: 'Success', detail: 'Login sucessfull!' });
                        this.router.navigate(['/feed']);
                    }
                    else {
                        this.status = 'Log in';
                        this.msgs = [];
                        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Something went wrong' });
                    }
                }, (err: HttpErrorResponse) => {
                    this.msgs = [];
                    this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Something went wrong!" });
                    this.status = 'Login';
                    this.disableLoginButton = false;
                }
            );
        }
    }

}

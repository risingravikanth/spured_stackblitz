import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/components/common/messageservice';
import { MobileDetectionService, SeoService } from '../shared/services';
import { AuthService } from '../shared/services/auth.service';
import { CurrentUserService } from '../shared/services/currentUser.service';
import { ToastrService } from '../shared/services/Toastr.service';
import { CustomCookieService } from '../shared/services/cookie.service';
 
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [NgbAlertConfig, SeoService, MobileDetectionService, MessageService, CurrentUserService, ToastrService]
})
export class LoginComponent implements OnInit {

    authForm: FormGroup;
    returnUrl: string;
    status: string = 'Sign in';
    disableLoginButton: boolean = false;
    loggedUser: any;
    errorTextMessage: string = '';
    public isMobile: boolean = false;
    public responseVo: any = { info: null, source: null, statusCode: null };
    public isValiUser = false;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private currentUser: CurrentUserService,
        private fb: FormBuilder,
        private seo: SeoService,
        private mobile: MobileDetectionService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private toastr: ToastrService,
        private customCookieService:CustomCookieService

    ) { }
    ngOnInit() {
        this.isMobile = this.mobile.isMobile();
        this.seo.generateTags({
            title: 'Sign in - SpurEd',
            description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
            slug: 'signin-page'
        })
        this.currentUser.setTitle("Sign in - SpurEd")
        if (this.currentUser.checkValidUser()) {
            this.isValiUser = true;
            if (isPlatformBrowser(this.platformId)) {
                window.open('/feed', "_self")
            }
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
                

        /*this.cookies.put('some_cookie', 'some_cookie');
        this.cookies.put('http_only_cookie', 'http_only_cookie', {
                httpOnly: true
        });
        console.log("In side of login component NGONINIT");
        console.log(this.cookies.getAll());


        this.authService.setCookie('some_cookie', 'some_cookie');
        console.log(this.authService.getAuth('some_cookie'), ' => some_cookie ');*/

   
    }   
    onLoggedin() {
        this.errorTextMessage = '';
        if (this.authForm.valid) {
            this.status = 'Logging in, please wait...';
            this.disableLoginButton = true;
            this.authService.attemptAuth(this.authForm.value, this.returnUrl).subscribe(
                resData => {
                    this.responseVo = JSON.parse(resData.body);
                    if (this.responseVo && this.responseVo.error && this.responseVo.error.code) {
                        this.status = 'Sign in';
                        this.errorTextMessage = this.responseVo.error.code.longMessage;
                        // this.toastr.error("Failed", this.responseVo.error.code.longMessage);
                    }
                    else if (this.responseVo.statusCode == "ERROR") {
                        this.errorTextMessage = this.responseVo.info;
                        this.status = 'Sign in';
                    } else if (this.responseVo.token) {
                        this.loggedUser = this.responseVo;
                        this.authService.setAuth(this.loggedUser);

                        // this.customCookieService.saveTrackId(this.responseVo.token);
                        //this.cookies.put('some_cookie1', 'some_cookie1');

                        // this.toastr.success("Success", "Login sucessfull!");
                        this.router.navigate(['/feed']);
                    }
                    else {
                        this.status = 'Sign in';
                        this.errorTextMessage = 'Something went wrong';
                        // this.toastr.error("Failed", 'Something went wrong')
                    }
                }, (err: HttpErrorResponse) => {
                    // this.toastr.error("Failed", 'Something went wrong')
                    this.errorTextMessage = 'Something went wrong';
                    this.status = 'Sign in';
                    this.disableLoginButton = false;
                }
            );
        }
    }

}

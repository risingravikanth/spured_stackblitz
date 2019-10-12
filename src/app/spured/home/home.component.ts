import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, GoogleLoginProvider } from 'angular-6-social-login';
import { MessageService } from 'primeng/components/common/messageservice';
import { MobileDetectionService, SeoService } from '../../shared';
import { User } from '../../shared/models/user.model';
import { AuthenticationService } from '../../shared/services/auth.service';
import { CustomCookieService } from '../../shared/services/cookie.service';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { ToastrService } from '../../shared/services/Toastr.service';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [NgbAlertConfig, SeoService, MobileDetectionService, MessageService, CurrentUserService, ToastrService]
})
export class HomeComponent implements OnInit {
    currentUser: User;
    public validUser: boolean = false;
    authForm: FormGroup;
    returnUrl: string;
    status: string = 'Login';
    disableLoginButton: boolean = false;
    loggedUser: any;
    errorTextMessage: string = '';
    public isMobile: boolean = false;
    public responseVo: any = { info: null, source: null, statusCode: null };
    public isValiUser = false;
    public gistMessageAry: any = [
        "Spured is a learning management system for college & students to share anything related to education & college.",
        "Boards are the hierarchy of spaces with students belongs to various batches, departments, classes and sections.",
        "A student of a class belong to his/her class board, department board, batch board and college board.",
        "Groups in the college (institute groups) are useful to create groups for various topics of discussions such as subject, library, college fest group and so on.",
        "Spured is also a knowledge networking platform to connect with scholars beyond the college.",
        "Content or questions related various sections or models of competitive exams, results, jobs, news, current affairs, any kind of events, higher education.",
        "Public groups are meant for discussion on any topic, anyone can join any public group and view content in that group.",
        "Various sections of the competitive exams are organized into categories and models to find the content what exactly needed."
    ];
    public counter: any = 0;
    public gistMessage: any = this.gistMessageAry[this.counter];
    public someInterval: any;

    public isLogin: boolean = true;
    public isSignup: boolean = false;
    public isForgotPwd: boolean = false;

    constructor(private zone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationService,
        private currentUserService: CurrentUserService,
        private fb: FormBuilder,
        private seo: SeoService,
        private mobile: MobileDetectionService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private toastr: ToastrService,
        private customCookieService: CustomCookieService,
        private socialAuthService: AuthService) {
        let self = this;
        /*this.zone.runOutsideAngular(() => { self.someInterval = setInterval(() => { 
            // Your Code 
            self.changeGistMessages();
        }, 1000) })*/

    }

    changeGistMessages() {
        this.gistMessage = this.gistMessageAry[this.counter];
        this.counter++;
        if (this.counter == this.gistMessageAry.length) {
            this.counter = 0;
        }
    }
    ngOnInit() {

        this.seo.generateTags({
            title: 'SpurEd - Spur Encouragement to Education',
            description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
            slug: 'SpurEd'
        })
        this.currentUserService.setTitle("SpurEd - Spur Encouragement to Education");

        if (this.currentUserService.checkValidUser()) {
            this.isValiUser = true;
            // if (isPlatformBrowser(this.platformId)) {
            //     window.open('/feed', "_self")
            // }
        }
        this.isMobile = this.mobile.isMobile();
        let status = this.route.snapshot.queryParams['status'];
        if (status) {
            this.errorTextMessage = 'Session Expired... Login Again !'
            setTimeout(() => {
                this.errorTextMessage = "";
            }, 5000);
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
            this.status = 'Logging in...';
            this.disableLoginButton = true;
            this.loginMethod(this.authForm.value);

        }
    }

    loginMethod(body: any) {
        this.authService.attemptAuth(body, this.returnUrl).subscribe(
            resData => {
                this.responseVo = JSON.parse(resData.body);
                if (this.responseVo && this.responseVo.error && this.responseVo.error.code) {
                    this.status = 'Login';
                    this.errorTextMessage = this.responseVo.error.code.longMessage;
                    // this.toastr.error("Failed", this.responseVo.error.code.longMessage);
                } else if (this.responseVo.statusCode == "ERROR") {
                    this.errorTextMessage = this.responseVo.info;
                    this.status = 'Login';
                } else if (this.responseVo.token) {
                    this.loggedUser = this.responseVo;
                    this.authService.setAuth(this.loggedUser);

                    // this.customCookieService.saveTrackId(this.responseVo.token);
                    //this.cookies.put('some_cookie1', 'some_cookie1');

                    // this.toastr.success("Success", "Login sucessfull!");
                    this.router.navigate(['/feed']);
                }
                else {
                    this.status = 'Login';
                    this.errorTextMessage = 'Something went wrong';
                    // this.toastr.error("Failed", 'Something went wrong')
                }
                setTimeout(() => {
                    this.errorTextMessage = "";
                }, 5000);
            }, (err: HttpErrorResponse) => {
                // this.toastr.error("Failed", 'Something went wrong')
                this.errorTextMessage = 'Something went wrong';
                this.status = 'Login';
                this.disableLoginButton = false;
                setTimeout(() => {
                    this.errorTextMessage = "";
                }, 5000);
            }
        );
    }

    loginGoogle() {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((userData: any) => {
            console.log(userData);
            if (userData && userData.idToken) {
                let loginVo = {
                    provider: "GOOGLE",
                    idToken: userData.idToken
                }
                this.loginMethod(loginVo);
            } else {
                // alert('Something went wrong');
                this.errorTextMessage = 'Something went wrong';
                setTimeout(() => {
                    this.errorTextMessage = "";
                }, 5000);
            }
        });
    }


    updateForm(type: any) {
        switch (type) {
            case "SIGNUP":
                this.isForgotPwd = false;
                this.isLogin = false;
                this.isSignup = true;
                break;
            case "LOGIN":
                this.isForgotPwd = false;
                this.isLogin = true;
                this.isSignup = false;
                break;
            case "FORGOT_PWD":
                this.isForgotPwd = true;
                this.isLogin = false;
                this.isSignup = false;
                break;
        }
    }

}

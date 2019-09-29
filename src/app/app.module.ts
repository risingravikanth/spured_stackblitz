import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatStepperModule } from '@angular/material';
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserCookiesModule } from '@ngx-utils/cookies/browser';
import { CookieService } from 'ngx-cookie-service';
import { TimeAgoPipe } from 'time-ago-pipe';
import { AccountActivateComponent } from "./account-activate/account-activate.component";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundModule } from './not-found/not-found.module';
import { HeaderMobileModule } from "./spured/header/header-mobile/header-mobile.module";
import { HelpModule } from './spured/help/help.module';
import { OthersProfileModule } from './spured/profile-other/profile-other.module';
import { SelfProfileModule } from './spured/profile-self/profile-self.module';
import { ReportUsModule } from './spured/report-us/report-us.module';
import { SettingsModule } from './spured/settings/settings.module';
import { PasswordResetLinkModule } from "./password-reset-link/password-reset-link.module";
import { PasswordResetModule } from './password-reset/password-reset.module';
import { AuthCanLoadGuard, AuthGuard, CommonService } from './shared/index';
import { TokenInterceptor } from './shared/inerceptors/token.interceptor';
import { DatePickerFormat } from './shared/others/datepickerFormat';
import { TimePickerFormat } from "./shared/others/timepickerFormat";
import { AuthenticationService } from './shared/services/auth.service';
import { CustomCookieService } from "./shared/services/cookie.service";
import { CurrentUserService } from './shared/services/currentUser.service';
import { JwtService } from './shared/services/jwt.service';
import { MobileDetectionService } from './shared/services/mobiledetection.service';
import { UserSetupModule } from './user-setup/user-setup.module';
import { ToastrModule } from 'ng6-toastr-notifications';
import { SpuredModule } from "./spured/spured.module";
import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider,
    // FacebookLoginProvider
 } from 'angular-6-social-login';


 export function getAuthServiceConfigs() {
    const config = new AuthServiceConfig(
    [
    // {
    //     id: FacebookLoginProvider.PROVIDER_ID,
    //     provider: new FacebookLoginProvider('Your_Facebook_Client_ID')
    // },
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('706905826330-qfg497pds4qp246qmtukjpg86tjh7l0g.apps.googleusercontent.com')
    }
    ]
    );
    return config;
}

@NgModule({
    declarations: [
        AppComponent,
        AccountActivateComponent,
        TimeAgoPipe
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'noticer' }),
        BrowserCookiesModule.forRoot(),
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        UserSetupModule,
        NotFoundModule,
        OthersProfileModule,
        SelfProfileModule,
        SpuredModule,
        PasswordResetModule,
        HelpModule,
        SettingsModule,
        ReportUsModule,
        HeaderMobileModule,
        BrowserAnimationsModule,
        BrowserTransferStateModule,
        // TransferHttpCacheModule,
        PasswordResetLinkModule,
        SocialLoginModule,
        ToastrModule.forRoot()
    ],
    providers: [
        AuthGuard,
        AuthCanLoadGuard,
        JwtService,
        CurrentUserService,
        DatePickerFormat,
        TimePickerFormat,
        MatProgressSpinnerModule,
        AuthenticationService,
        CommonService,
        MobileDetectionService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },

        CookieService,
        CustomCookieService,
        {
            provide: AuthServiceConfig,
            useFactory: getAuthServiceConfigs
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

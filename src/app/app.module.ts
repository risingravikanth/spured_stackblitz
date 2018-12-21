import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatStepperModule } from '@angular/material';
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundModule } from './not-found/not-found.module';
import { HeaderMobileModule } from "./noticer/header-mobile/header-mobile.module";
import { HelpModule } from './noticer/help/help.module';
import { NoticerModule } from './noticer/noticer.module';
import { OthersProfileModule } from './noticer/profile-other/profile-other.module';
import { SelfProfileModule } from './noticer/profile-self/profile-self.module';
import { ReportUsModule } from './noticer/report-us/report-us.module';
import { SettingsModule } from './noticer/settings/settings.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { AuthCanLoadGuard, AuthGuard, CommonService } from './shared/index';
import { TokenInterceptor } from './shared/inerceptors/token.interceptor';
import { DatePickerFormat } from './shared/others/datepickerFormat';
import { TimePickerFormat } from "./shared/others/timepickerFormat";
import { AuthService } from './shared/services/auth.service';
import { CurrentUserService } from './shared/services/currentUser.service';
import { JwtService } from './shared/services/jwt.service';
import { MobileDetectionService } from './shared/services/mobiledetection.service';
import { UserSetupModule } from './user-setup/user-setup.module';
import { AccountActivateComponent } from "./account-activate/account-activate.component";

import {TimeAgoPipe} from 'time-ago-pipe';
import { TransferHttpCacheModule } from '@nguniversal/common';


@NgModule({
    declarations: [
        AppComponent,
        AccountActivateComponent,
        TimeAgoPipe
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'noticer' }),
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
        NoticerModule,
        PasswordResetModule,
        HelpModule,
        SettingsModule,
        ReportUsModule,
        HeaderMobileModule,
        BrowserAnimationsModule,
        // BrowserTransferStateModule,
        TransferHttpCacheModule
    ],
    providers: [
        AuthGuard,
        AuthCanLoadGuard,
        JwtService,
        CurrentUserService,
        DatePickerFormat,
        TimePickerFormat,
        MatProgressSpinnerModule,
        AuthService,
        CommonService,
        MobileDetectionService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}

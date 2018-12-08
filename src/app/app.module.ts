import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatStepperModule } from '@angular/material';
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SidebarModule } from "primeng/primeng";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotFoundModule } from './not-found/not-found.module';
import { HelpModule } from './noticer/help/help.module';
import { NoticerMainModule } from './noticer/noticer-main/noticer-main.module';
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
import { HeaderMobileModule } from "./shared/components/header-mobile/header-mobile.module";


@NgModule({
    declarations: [
        AppComponent
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
        NoticerMainModule,
        PasswordResetModule,
        HelpModule,
        SettingsModule,
        ReportUsModule,
        HeaderMobileModule,
        BrowserAnimationsModule
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

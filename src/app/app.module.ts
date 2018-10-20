import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthGuard, CommonService, AuthCanLoadGuard } from './shared/index';
import { TokenInterceptor } from './shared/inerceptors/token.interceptor';
import { JwtService } from './shared/services/jwt.service';
import { CurrentUserService } from './shared/services/currentUser.service';
import { AuthService } from './shared/services/auth.service';
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule, MatStepperModule } from '@angular/material';
import { DatePickerFormat } from './shared/others/datepickerFormat';
import { TimePickerFormat } from "./shared/others/timepickerFormat";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MobileDetectionService } from './shared/services/mobiledetection.service';
import { UserSetupModule } from './user-setup/user-setup.module';
import { NotFoundModule } from './not-found/not-found.module';
import { UserProfileModule } from './noticer/user-profile/user-profile.module';
import { NoticerModule } from './noticer/noticer.module';
import { NoticerMainModule } from './noticer/noticer-main/noticer-main.module';
import { HelpModule } from './noticer/help/help.module';
import { SettingsModule } from './noticer/settings/settings.module';
import { ReportUsModule } from './noticer/report-us/report-us.module';
import { PasswordResetModule } from './password-reset/password-reset.module';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'noticer' }),
        BrowserAnimationsModule,
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
        UserProfileModule,
        NoticerModule,
        NoticerMainModule,
        PasswordResetModule,
        HelpModule,
        SettingsModule,
        ReportUsModule
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

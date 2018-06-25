import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Import HttpClientModule from @angular/common/http
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthGuard } from './shared/index';
import { TokenInterceptor } from './shared/inerceptors/token.interceptor';
import { JwtService } from './shared/services/jwt.service';
import { CurrentUserService } from './shared/services/currentUser.service';
import { AuthService } from './shared/services/auth.service';
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule, MatStepperModule } from '@angular/material';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DatePickerFormat } from './shared/others/datepickerFormat';
import { TimePickerFormat } from "./shared/others/timepickerFormat";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PermissionService } from './shared/services/permission.service';
import { NgxPermissionsService } from 'ngx-permissions';


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatStepperModule,
        MatProgressSpinnerModule,
        NgxPermissionsModule.forRoot()

    ],
    providers: [
        AuthGuard,
        JwtService,
        CurrentUserService,
        DatePickerFormat,
        TimePickerFormat,
        MatProgressSpinnerModule,
        PermissionService,
        AuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (ds: PermissionService, ps: NgxPermissionsService, cs: CurrentUserService) => function () {
                if (cs.checkValidUser()) {
                    return ds.getPermissions().subscribe((data) => {
                        let roleData: any = data;
                        let authority: string[] = [];
                        roleData.forEach(element => {
                            authority.push(element.authority);
                        });
                        return ps.loadPermissions(authority);
                    })
                }
            },
            deps: [PermissionService, NgxPermissionsService, CurrentUserService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

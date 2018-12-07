import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from "@angular/material/dialog";
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent, HeaderComponent, SidebarComponent } from '../shared';
import { HeaderMobileComponent } from '../shared/components/header-mobile/header-mobile.component';
import { AboutComponent } from './about/about.component';
import { NoticerRoutingModule } from './noticer-routing.module';
// import { NgxPermissionsModule } from 'ngx-permissions';
import { NoticerComponent } from './noticer.component';


@NgModule({
    imports: [
        CommonModule,
        NgbDropdownModule.forRoot(),
        NoticerRoutingModule,
        NgbModule.forRoot(),
        MatDialogModule,
        // NgxPermissionsModule.forChild()
    ],
    declarations: [
        NoticerComponent,
        HeaderComponent,
        HeaderMobileComponent,
        SidebarComponent,
        FooterComponent,
        AboutComponent
    ]
})
export class NoticerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent, SidebarComponent, FooterComponent } from '../shared';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from "@angular/material/dialog";
// import { NgxPermissionsModule } from 'ngx-permissions';
import { NoticerComponent } from './noticer.component';
import { NoticerRoutingModule } from './noticer-routing.module';
import {HeaderMobileComponent} from '../shared/components/header-mobile/header-mobile.component'


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
        FooterComponent
    ]
})
export class NoticerModule { }

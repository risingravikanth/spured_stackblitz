import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatGridListModule, MatListModule } from '@angular/material';
import { MatDialogModule } from "@angular/material/dialog";
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, ConfirmDialogModule, DropdownModule, MultiSelectModule, SidebarModule } from 'primeng/primeng';
import { FooterComponent, SidebarComponent, OopsErrorComponent } from '../shared';
import { AboutComponent } from './about/about.component';
import { HeaderMobileComponent } from './header-mobile/header-mobile.component';
import { HeaderMobileModule } from './header-mobile/header-mobile.module';
import { HeaderComponent } from './header/header.component';
import { NoticerMainComponent } from './noticer-main/noticer-main.component';
import { RightMenuComponent } from './noticer-main/right-menu/right-menu.component';
import { SideMenuComponent } from './noticer-main/side-menu/side-menu.component';
import { NoticerRoutingModule } from './noticer-routing.module';
import { NoticerComponent } from './noticer.component';
import { CreatePostComponent } from './noticer-main/create-post/create-post.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { NotificationsComponent } from './notifications/notifications.component';


@NgModule({
    imports: [
        CommonModule,
        NgbDropdownModule.forRoot(),
        NoticerRoutingModule,
        NgbModule.forRoot(),
        MatDialogModule,
        SidebarModule,
        HeaderMobileModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        MatListModule,
        CalendarModule,
        MatListModule,
        MatFormFieldModule,
        MultiSelectModule,
        DropdownModule,
        MatGridListModule,
        ConfirmDialogModule,
        OverlayPanelModule
    ],
    declarations: [
        NoticerComponent,
        HeaderComponent,
        HeaderMobileComponent,
        SidebarComponent,
        FooterComponent,
        OopsErrorComponent,
        AboutComponent,
        SideMenuComponent,
        NoticerMainComponent,
        RightMenuComponent,
        CreatePostComponent,
        NotificationsComponent
    ],
    exports:[SideMenuComponent]
})
export class NoticerModule { }

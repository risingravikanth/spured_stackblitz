import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatGridListModule, MatListModule, MatProgressSpinnerModule, MatTabsModule } from '@angular/material';
import { MatDialogModule } from "@angular/material/dialog";
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule, ConfirmDialogModule, DropdownModule, MultiSelectModule, SidebarModule } from 'primeng/primeng';
import { ClockComponent, FooterComponent, OopsErrorComponent, SidebarComponent } from '../shared';
import { AboutComponent } from './about/about.component';
import { HeaderMobileComponent } from './header-mobile/header-mobile.component';
import { HeaderMobileModule } from './header-mobile/header-mobile.module';
import { HeaderComponent } from './header/header.component';
import { CreatePostComponent } from './noticer-main/create-post/create-post.component';
import { NoticerMainComponent } from './noticer-main/noticer-main.component';
import { RightMenuComponent } from './noticer-main/right-menu/right-menu.component';
import { SideMenuComponent } from './noticer-main/side-menu/side-menu.component';
import { NoticerRoutingModule } from './noticer-routing.module';
import { NoticerComponent } from './noticer.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SelfProfileComponent } from './profile-self/profile-self.component';
import { SelfProfileModule } from './profile-self/profile-self.module';
import { MyDatePickerModule } from 'mydatepicker';
import { OthersProfileComponent } from './profile-other/profile-other.component';
import { OthersProfileModule } from './profile-other/profile-other.module';


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
        OverlayPanelModule,
        InfiniteScrollModule,
        SelfProfileModule,
        OthersProfileModule,
        CalendarModule,
        MyDatePickerModule,
        MatProgressSpinnerModule,
        MatTabsModule
    ],
    declarations: [
        NoticerComponent,
        HeaderComponent,
        HeaderMobileComponent,
        SidebarComponent,
        FooterComponent,
        OopsErrorComponent,
        ClockComponent,
        AboutComponent,
        SideMenuComponent,
        NoticerMainComponent,
        RightMenuComponent,
        CreatePostComponent,
        NotificationsComponent,
        SelfProfileComponent,
        OthersProfileComponent
    ],
    exports: [SideMenuComponent, NoticerMainComponent]
})
export class NoticerModule { }

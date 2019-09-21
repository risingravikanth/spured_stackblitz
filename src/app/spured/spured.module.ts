import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatGridListModule, MatListModule, MatProgressSpinnerModule, MatTabsModule } from '@angular/material';
import { MatDialogModule } from "@angular/material/dialog";
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule, ConfirmDialogModule, DropdownModule, MultiSelectModule, SidebarModule, ChipsModule } from 'primeng/primeng';
import { ClockComponent, FooterComponent, OopsErrorComponent } from '../shared';
import { AboutComponent } from './about/about.component';
import { HeaderMobileComponent } from './header/header-mobile/header-mobile.component';
import { HeaderMobileModule } from './header/header-mobile/header-mobile.module';
import { HeaderComponent } from './header/header.component';
import { CreatePostComponent } from './core-main/create-post/create-post.component';
import { CoreMainComponent } from './core-main/core-main.component';
import { RightMenuComponent } from './core-main/right-menu/right-menu.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SelfProfileComponent } from './profile-self/profile-self.component';
import { SelfProfileModule } from './profile-self/profile-self.module';
import { MyDatePickerModule } from 'mydatepicker';
import { OthersProfileComponent } from './profile-other/profile-other.component';
import { OthersProfileModule } from './profile-other/profile-other.module';
import { AdminComponent } from './admin/admin.component';
import { AdminBoardComponent } from './admin/admin-board/admin-board.component';
import { AdminGroupComponent } from './admin/admin-group/admin-group.component';
import { PreviewComponent } from './core-main/view-post/preview/preview.component';
import { PreviewDialogComponent } from './core-main/view-post/preview/preview-dialog/preview-dialog.component';
import { SpuredRoutingModule } from '../spured/spured-routing.module';
import { SpuredComponent } from '../spured/spured.component';
import { LeftMenuComponent } from './core-main/left-menu/left-menu.component';
import { HomeComponent } from './home/home.component';
import { NgxContentLoadingModule } from 'ngx-content-loading';
 


@NgModule({
    imports: [
        CommonModule,
        NgbDropdownModule.forRoot(),
        SpuredRoutingModule,
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
        MatTabsModule,
        ChipsModule,
        NgxContentLoadingModule
    ],
    declarations: [
        SpuredComponent,
        HeaderComponent,
        HeaderMobileComponent,
        FooterComponent,
        OopsErrorComponent,
        ClockComponent,
        AboutComponent,
        LeftMenuComponent,
        HomeComponent,
        CoreMainComponent,
        RightMenuComponent,
        CreatePostComponent,
        NotificationsComponent,
        PreviewComponent,
        PreviewDialogComponent,
        SelfProfileComponent,
        OthersProfileComponent,
        AdminComponent,
        AdminBoardComponent,
        AdminGroupComponent
    ],
    entryComponents : [PreviewDialogComponent],
    exports: [LeftMenuComponent, CoreMainComponent]
})
export class SpuredModule { }

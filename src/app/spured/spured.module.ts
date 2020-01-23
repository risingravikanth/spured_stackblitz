import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatGridListModule, MatInputModule, MatListModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatTabsModule, MatCheckboxModule, MatExpansionModule, MatAutocompleteModule, MatButtonToggleModule, MatCardModule } from '@angular/material';
import { MatDialogModule } from "@angular/material/dialog";
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule, ChipsModule, ConfirmDialogModule, DropdownModule, MultiSelectModule, SidebarModule } from 'primeng/primeng';
import { ClockComponent, FooterComponent, OopsErrorComponent } from '../shared';
import { SpuredRoutingModule } from '../spured/spured-routing.module';
import { SpuredComponent } from '../spured/spured.component';
import { AboutComponent } from './about/about.component';
import { AdminBoardComponent } from './admin/admin-board/admin-board.component';
import { AdminGroupComponent } from './admin/admin-group/admin-group.component';
import { AdminComponent } from './admin/admin.component';
import { CoreMainComponent } from './core-main/core-main.component';
import { CreatePostComponent } from './core-main/create-post/create-post.component';
import { LeftMenuComponent } from './core-main/left-menu/left-menu.component';
import { RightMenuComponent } from './core-main/right-menu/right-menu.component';
import { PreviewDialogComponent } from './core-main/view-post/preview/preview-dialog/preview-dialog.component';
import { CreatePostDialogComponent } from './core-main/create-post/create-post-dialog/create-post-dialog.component';
import { PreviewComponent } from './core-main/view-post/preview/preview.component';
import { HeaderMobileComponent } from './header/header-mobile/header-mobile.component';
import { HeaderMobileModule } from './header/header-mobile/header-mobile.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { OthersProfileComponent } from './profile-other/profile-other.component';
import { OthersProfileModule } from './profile-other/profile-other.module';
import { SelfProfileComponent } from './profile-self/profile-self.component';
import { SelfProfileModule } from './profile-self/profile-self.module';
import { QuizAttemptReviewComponent } from './quiz/quiz-attempt-review/quiz-attempt-review.component';
import { QuizCreateUpdateStatsComponent } from './quiz/quiz-create-update-stats/quiz-create-update-stats.component';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';


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
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        NgxContentLoadingModule,
        MatCheckboxModule,
        MatExpansionModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
		MatCardModule,
        SharedPipesModule
        
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
        CreatePostDialogComponent,
        SelfProfileComponent,
        OthersProfileComponent,
        AdminComponent,
        AdminBoardComponent,
        AdminGroupComponent,
        UserSetupComponent,
        PasswordResetComponent,
        QuizAttemptReviewComponent,
        QuizCreateUpdateStatsComponent
    ],
    entryComponents: [PreviewDialogComponent,
                      CreatePostDialogComponent],
    exports: [LeftMenuComponent, CoreMainComponent]
})
export class SpuredModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NoticerComponent } from './noticer/noticer.component';
import { NoticerMainComponent } from './noticer/noticer-main/noticer-main.component';
import { UserProfileComponent } from './noticer/user-profile/user-profile.component';
import { MenuMobileComponent } from './noticer/noticer-main/menu-mobile/menu-mobile.component';
import { HelpComponent } from './noticer/help/help.component';
import { SettingsComponent } from './noticer/settings/settings.component';
import { ReportUsComponent } from './noticer/report-us/report-us.component';

const routes: Routes = [
    {
        path: 'noticer',
        component: NoticerComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: NoticerMainComponent,
            // canActivate: [AuthGuard]
          },
          {
            path: 'user-profile',
            component: UserProfileComponent,
            // canActivate: [AuthGuard]
          },
          {
            path: 'mobile-menu',
            component: MenuMobileComponent,
            // canActivate: [AuthGuard]
          },
          {
            path: 'help',
            component: HelpComponent,
            // canActivate: [AuthGuard]
          },
          {
            path: 'reportus',
            component: ReportUsComponent,
            // canActivate: [AuthGuard]
          },
          {
            path: 'settings',
            component: SettingsComponent,
            // canActivate: [AuthGuard]
          }
        ]
    },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'not-found', component: NotFoundComponent },
    { path: 'user-setup', component: UserSetupComponent },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    // providers:[{provide: LocationStrategy, useClass: HashLocationStrategy}],
    exports: [RouterModule]
})
export class AppRoutingModule { }

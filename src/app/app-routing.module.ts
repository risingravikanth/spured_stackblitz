import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { HelpComponent } from './noticer/help/help.component';
import { MenuMobileComponent } from './noticer/noticer-main/menu-mobile/menu-mobile.component';
import { NoticerMainComponent } from './noticer/noticer-main/noticer-main.component';
import { NoticerComponent } from './noticer/noticer.component';
import { ReportUsComponent } from './noticer/report-us/report-us.component';
import { SettingsComponent } from './noticer/settings/settings.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AuthGuard } from './shared';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { OthersProfileComponent } from './noticer/profile-other/profile-other.component';
import { SelfProfileComponent } from './noticer/profile-self/profile-self.component';

const routes: Routes = [
  {
    path: 'feed',
    component: NoticerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: NoticerMainComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'mobile-menu',
        component: MenuMobileComponent,
        // canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'categories/:type',
    component: NoticerComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: NoticerMainComponent,
        // canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'categories/:type/:category',
    component: NoticerComponent,
    // canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: NoticerMainComponent,
        // canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'posts/:type/:category/:id',
    component: NoticerComponent,
    children: [
      {
        path: '',
        component: NoticerMainComponent,
        // canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'profile',
    component: NoticerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'self',
        component: SelfProfileComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'users/:id',
        component: OthersProfileComponent,
        // canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'help',
    component: NoticerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HelpComponent,
        // canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'reportus',
    component: NoticerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ReportUsComponent,
        // canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'settings',
    component: NoticerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SettingsComponent,
        // canActivate: [AuthGuard]
      }
    ]
  },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'signup', component: UserSetupComponent },
  { path: 'password_reset', component: PasswordResetComponent },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  // providers:[{provide: LocationStrategy, useClass: HashLocationStrategy}],
  exports: [RouterModule]
})
export class AppRoutingModule { }

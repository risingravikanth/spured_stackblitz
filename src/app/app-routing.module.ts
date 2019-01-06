import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './noticer/about/about.component';
import { HelpComponent } from './noticer/help/help.component';
import { NoticerMainComponent } from './noticer/noticer-main/noticer-main.component';
import { NoticerComponent } from './noticer/noticer.component';
import { OthersProfileComponent } from './noticer/profile-other/profile-other.component';
import { SelfProfileComponent } from './noticer/profile-self/profile-self.component';
import { ReportUsComponent } from './noticer/report-us/report-us.component';
import { SettingsComponent } from './noticer/settings/settings.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AuthGuard } from './shared';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { AccountActivateComponent } from './account-activate/account-activate.component';
import { NotificationsComponent } from './noticer/notifications/notifications.component';
import { PasswordResetLinkComponent } from './password-reset-link/password-reset-link.component';

const routes: Routes = [
  {
    path: 'feed',
    component: NoticerComponent,
    children: [
      {
        path: '',
        component: NoticerMainComponent,
      }
    ]
  },
  {
    path: 'categories',
    component: NoticerComponent,
    children: [
      {
        path: ':type',
        component: NoticerMainComponent,
      },
      {
        path: ':type/:category',
        component: NoticerMainComponent,
      },
      {
        path: ':type/:category/:model',
        component: NoticerMainComponent,
      }
    ]
  },
  {
    path: 'posts',
    component: NoticerComponent,
    children: [
      {
        path: 'closed/:id',
        component: NoticerMainComponent,
      },
      {
        path: 'closed/:id/:title',
        component: NoticerMainComponent,
      },
      {
        path: ':type/:category/:id',
        component: NoticerMainComponent,
      },
      {
        path: ':type/:category/:id/:title',
        component: NoticerMainComponent,
      }
    ]
  },
  {
    path: 'boards',
    component: NoticerComponent,
    children: [
      {
        path: 'closed/:boardId',
        component: NoticerMainComponent,
      },
      {
        path: 'closed/:boardId/:title',
        component: NoticerMainComponent,
      }
    ]
  },
  {
    path: 'profile',
    component: NoticerComponent,
    children: [
      {
        path: 'self',
        component: SelfProfileComponent,
        // canActivate: [AuthGuard]
      },
      {
        path: 'users/:id',
        component: OthersProfileComponent,
      }
    ]
  },
  {
    path: 'help',
    component: NoticerComponent,
    children: [
      {
        path: '',
        component: HelpComponent,
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
      }
    ]
  },
  {
    path: 'about',
    component: NoticerComponent,
    children: [
      {
        path: '',
        component: AboutComponent,
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
      }
    ]
  },
  {
    path: 'notifications',
    component: NoticerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: NotificationsComponent,
      }
    ]
  },
  { path: 'users/activate/:code', component: AccountActivateComponent },
  { path: 'users/password_reset/:code', component: PasswordResetLinkComponent },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
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

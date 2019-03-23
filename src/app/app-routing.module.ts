import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './spured/about/about.component';
import { HelpComponent } from './spured/help/help.component';
import { CoreMainComponent } from './spured/core-main/core-main.component';
import { OthersProfileComponent } from './spured/profile-other/profile-other.component';
import { SelfProfileComponent } from './spured/profile-self/profile-self.component';
import { ReportUsComponent } from './spured/report-us/report-us.component';
import { SettingsComponent } from './spured/settings/settings.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AuthGuard } from './shared';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { AccountActivateComponent } from './account-activate/account-activate.component';
import { NotificationsComponent } from './spured/notifications/notifications.component';
import { PasswordResetLinkComponent } from './password-reset-link/password-reset-link.component';
import { AdminComponent } from './spured/admin/admin.component';
import { SpuredComponent } from './spured/spured.component';

const routes: Routes = [
  {
    path: 'feed',
    component: SpuredComponent,
    children: [
      {
        path: '',
        component: CoreMainComponent,
      }
    ]
  },
  {
    path: 'categories',
    component: SpuredComponent,
    children: [
      {
        path: ':type',
        component: CoreMainComponent,
      },
      {
        path: ':type/:category',
        component: CoreMainComponent,
      },
      {
        path: ':type/:category/:model',
        component: CoreMainComponent,
      }
    ]
  },
  {
    path: 'posts',
    component: SpuredComponent,
    children: [
      {
        path: 'groups/:id',
        component: CoreMainComponent,
      },
      {
        path: 'groups/:id/:title',
        component: CoreMainComponent,
      },
      {
        path: 'closed/:id',
        component: CoreMainComponent,
      },
      {
        path: 'closed/:id/:title',
        component: CoreMainComponent,
      },
      {
        path: ':type/:category/:id',
        component: CoreMainComponent,
      },
      {
        path: ':type/:category/:id/:title',
        component: CoreMainComponent,
      }
    ]
  },
  {
    path: 'boards',
    component: SpuredComponent,
    children: [
      {
        path: 'closed/:boardId',
        component: CoreMainComponent,
      },
      {
        path: 'closed/:boardId/:title',
        component: CoreMainComponent,
      }
    ]
  },
  {
    path: 'groups',
    component: SpuredComponent,
    children: [
      {
        path: ':groupId',
        component: CoreMainComponent,
      },
      {
        path: ':groupId/:title',
        component: CoreMainComponent,
      }
    ]
  },
  {
    path: 'profile',
    component: SpuredComponent,
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
    component: SpuredComponent,
    children: [
      {
        path: '',
        component: HelpComponent,
      }
    ]
  },
  {
    path: 'reportus',
    component: SpuredComponent,
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
    component: SpuredComponent,
    children: [
      {
        path: '',
        component: AboutComponent,
      }
    ]
  },
  {
    path: 'settings',
    component: SpuredComponent,
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
    component: SpuredComponent,
    children: [
      {
        path: '',
        component: NotificationsComponent,
      }
    ]
  },
  {
    path: 'admin',
    component: SpuredComponent,
    children: [
      {
        path: '',
        component: AdminComponent,
        canActivate:[AuthGuard]
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

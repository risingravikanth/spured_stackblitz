import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';

const routes: Routes = [
    {
        path: 'noticer',
        loadChildren: './noticer/noticer.module#NoticerModule'
    },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
    { path: 'user-setup', loadChildren: './user-setup/user-setup.module#UserSetupModule' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

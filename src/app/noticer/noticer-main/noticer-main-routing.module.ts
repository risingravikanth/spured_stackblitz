import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { NgxPermissionsGuard } from 'ngx-permissions';
import { NoticerMainComponent } from './noticer-main.component';
import { AuthGuard } from '../../shared';
import { MenuMobileComponent } from './menu-mobile/menu-mobile.component';

const routes: Routes = [
    {
        path: '', 
        component: NoticerMainComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'menu',
        component: MenuMobileComponent,
        canActivate: [AuthGuard]
    }       
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NoticerMainRoutingModule { }

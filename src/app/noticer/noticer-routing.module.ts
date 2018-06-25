import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/index';
import { NoticerComponent } from './noticer.component';

const routes: Routes = [
    {
        path: '', component: NoticerComponent,
        // canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'main', pathMatch: 'full' },
            {
                path: 'main',
                loadChildren: './noticer-main/noticer-main.module#NoticerMainModule',
                // canActivate: [AuthGuard]
            }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NoticerRoutingModule { }

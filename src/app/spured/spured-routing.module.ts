import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/index';
import { SpuredComponent } from '../spured/spured.component';

const routes: Routes = [
    {
        path: '', component: SpuredComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'main', pathMatch: 'full' },
            {
                path: 'main',
                loadChildren: './core-main/core-main.module#CoreMainModule',
                canActivate: [AuthGuard]
            },
            {
                path: 'user-profile',
                loadChildren: "./user-profile/user-profile.module#UserProfileModule",
                canActivate: [AuthGuard]
            }
        ]
    }
];


@NgModule({
    // imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpuredRoutingModule { }

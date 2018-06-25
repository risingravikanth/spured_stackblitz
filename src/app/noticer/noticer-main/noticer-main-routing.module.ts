import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { NoticerMainComponent } from './noticer-main.component';

const routes: Routes = [
    {
    //     path: '', component: VehicleOffRoadComponent,
    //     children: [
    //         { path: '', redirectTo: 'list', pathMatch: 'full' },
    //         {
    //             path: 'create', component: VehicleOffRoadCreateComponent,
    //             canActivate: [NgxPermissionsGuard],
    //             data: {
    //                 permissions: {
    //                     only: 'VEHICLE_MANAGEMENT',
    //                     redirectTo: '/not-found'
    //                 }
    //             }
    //         },
    //         {
    //             path: 'list', component: VehicleOffRoadListComponent,
    //             canActivate: [NgxPermissionsGuard],
    //             data: {
    //                 permissions: {
    //                     only: 'VEHICLE_MANAGEMENT',
    //                     redirectTo: '/not-found'
    //                 }
    //             }
    //         },
    //     ]
    // }
    path: '', component: NoticerMainComponent
    // ,
    //     canActivate: [NgxPermissionsGuard],
    //     data: {
    //         permissions: {
    //             only: 'VEHICLE_MANAGEMENT',
    //             redirectTo: '/not-found'
    //         }
    //     }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NoticerMainRoutingModule { }

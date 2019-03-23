import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OthersProfileComponent } from './profile-other.component';

const routes: Routes = [
    {
        path: '', component: OthersProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OthersProfileRoutingModule { }

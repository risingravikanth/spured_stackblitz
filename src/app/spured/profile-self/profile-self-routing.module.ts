import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelfProfileComponent } from './profile-self.component';

const routes: Routes = [
    {
        path: '', component: SelfProfileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SelfProfileRoutingModule { }

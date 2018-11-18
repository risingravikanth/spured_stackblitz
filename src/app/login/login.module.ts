import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GrowlModule } from 'primeng/primeng';

const routes: Routes = [
    { path: '', component: LoginComponent }
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NgbModule,
        GrowlModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {
}

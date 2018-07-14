import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSetupComponent } from './user-setup.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { MatInputModule, MatStepperModule, MatProgressSpinnerModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { GrowlModule } from "primeng/primeng";

const routes: Routes = [
  { path: '', component: UserSetupComponent }
];
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    GrowlModule,
    // RouterModule.forChild(routes)
  ],
  declarations: [
    UserSetupComponent
  ]
})
export class UserSetupModule { }

export interface ParamMap {
  timeformat: string;
  dateformat: any;
  timezone: any;
  currencyformat: any;
}

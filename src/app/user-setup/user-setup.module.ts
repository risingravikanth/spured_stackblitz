import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSelectModule, MatStepperModule } from '@angular/material';
import { Routes } from '@angular/router';
import { UserSetupComponent } from './user-setup.component';

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

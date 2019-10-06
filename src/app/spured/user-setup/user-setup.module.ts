import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule, MatInputModule } from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import { RouterModule, Routes } from '@angular/router';
 
import { UserSetupComponent } from './user-setup.component';

const routes: Routes = [
  { path: '', component: UserSetupComponent }
];
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatRadioModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    
  ]
})
export class UserSetupModule { }

export interface ParamMap {
  timeformat: string;
  dateformat: any;
  timezone: any;
  currencyformat: any;
}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';
import { CalendarModule, GrowlModule } from 'primeng/primeng';
import { SelfProfileRoutingModule } from './profile-self-routing.module';
import { SelfProfileComponent } from './profile-self.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    MatListModule,
    SelfProfileRoutingModule,
    NgbModule.forRoot(),
    CalendarModule,
    MyDatePickerModule,
    GrowlModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    SelfProfileComponent
  ],
  entryComponents: [],
})
export class SelfProfileModule { }

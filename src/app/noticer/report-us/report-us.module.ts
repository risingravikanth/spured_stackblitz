import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatDialogModule, MatProgressSpinnerModule, MatExpansionModule, MatListModule } from '@angular/material';
import { CalendarModule, GrowlModule, DialogModule } from "primeng/primeng";
import { ReportUsComponent } from './report-us.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    NgbModule.forRoot()
  ],
  declarations: [
    ReportUsComponent
  ],
  entryComponents: [],
})
export class ReportUsModule { }

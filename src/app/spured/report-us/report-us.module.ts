import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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

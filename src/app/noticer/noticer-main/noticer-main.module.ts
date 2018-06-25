import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatDialogModule, MatProgressSpinnerModule, MatExpansionModule, MatListModule } from '@angular/material';
import { CalendarModule, GrowlModule, DialogModule } from "primeng/primeng";
import { NoticerMainComponent } from './noticer-main.component';
import { NoticerMainRoutingModule } from './noticer-main-routing.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    MatListModule,
    NoticerMainRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    NoticerMainComponent
  ],
  entryComponents: [],
})
export class NoticerMainModule { }

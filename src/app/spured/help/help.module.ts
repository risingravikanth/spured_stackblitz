import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HelpComponent } from './help.component';
import { PanelModule } from 'primeng/primeng';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    PanelModule,
    NgbModule.forRoot()
  ],
  declarations: [
    HelpComponent
  ],
  entryComponents: [],
})
export class HelpModule { }

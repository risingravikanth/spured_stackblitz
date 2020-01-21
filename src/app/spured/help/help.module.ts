import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HelpComponent } from './help.component';
import { PanelModule } from 'primeng/primeng';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    PanelModule,
	SharedPipesModule,
    NgbModule.forRoot()
  ],
  declarations: [
    HelpComponent
  ],
  entryComponents: [],
})
export class HelpModule { }

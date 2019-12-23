import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from './settings.component';
import { DialogModule } from 'primeng/primeng';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    DialogModule,
	SharedPipesModule,
    NgbModule.forRoot()
  ],
  declarations: [
    SettingsComponent
  ],
  entryComponents: [],
})
export class SettingsModule { }

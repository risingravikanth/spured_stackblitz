import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelfProfileRoutingModule } from './profile-self-routing.module';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatListModule,
    SelfProfileRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    
  ],
  entryComponents: [],
})
export class SelfProfileModule { }

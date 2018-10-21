import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatListModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelfProfileComponent } from './profile-self.component';
import { SelfProfileRoutingModule } from './profile-self-routing.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    MatListModule,
    SelfProfileRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    SelfProfileComponent
  ],
  entryComponents: [],
})
export class SelfProfileModule { }

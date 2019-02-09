import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatListModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OthersProfileComponent } from './profile-other.component';
import { OthersProfileRoutingModule } from './profile-other-routing.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    MatListModule,
    OthersProfileRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    
  ],
  entryComponents: [],
})
export class OthersProfileModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatListModule, MatInputModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserProfileRoutingModule } from './password-reset-routing.module';
import { PasswordResetComponent } from './password-reset.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    MatInputModule,
    MatListModule,
    UserProfileRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    
  ],
  entryComponents: [],
})
export class PasswordResetModule { }

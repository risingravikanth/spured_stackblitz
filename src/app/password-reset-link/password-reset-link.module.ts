import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PasswordResetLinkComponent } from './password-reset-link.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule.forRoot()
  ],
  declarations: [
    PasswordResetLinkComponent
  ],
  entryComponents: [],
})
export class PasswordResetLinkModule { }

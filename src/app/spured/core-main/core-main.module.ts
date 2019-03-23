import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { CoreMainRoutingModule } from './core-main-routing.module';
 
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CoreMainRoutingModule,
    ClipboardModule,
    NgbModule.forRoot()
  ],
  declarations: [
    
  ],
  entryComponents: [],
})

export class CoreMainModule { }

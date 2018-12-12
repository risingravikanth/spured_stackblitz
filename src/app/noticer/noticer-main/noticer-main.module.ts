import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LinkifyPipe } from '../../shared/pipes/linkify.pipe';
import { NoticerMainRoutingModule } from './noticer-main-routing.module';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NoticerMainRoutingModule,
    NgbModule.forRoot()
  ],
  declarations: [
    LinkifyPipe
  ],
  entryComponents: [],
})
export class NoticerMainModule { }

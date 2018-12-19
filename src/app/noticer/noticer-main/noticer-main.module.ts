import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LinkifyPipe } from '../../shared/pipes/linkify.pipe';
import { NoticerMainRoutingModule } from './noticer-main-routing.module';
import { ClipboardModule } from 'ngx-clipboard';



@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NoticerMainRoutingModule,
    ClipboardModule,
    NgbModule.forRoot()
  ],
  declarations: [
    LinkifyPipe,
    TimeAgoPipe
  ],
  entryComponents: [],
})
export class NoticerMainModule { }

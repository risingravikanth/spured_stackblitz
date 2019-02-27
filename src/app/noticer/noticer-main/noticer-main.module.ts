import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardModule } from 'ngx-clipboard';
import { LinkifyPipe } from '../../shared/pipes/linkify.pipe';
import { NoticerMainRoutingModule } from './noticer-main-routing.module';

// import {TimeAgoPipe} from 'time-ago-pipe';


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
    // PreviewDialogComponent,
    // TimeAgoPipe
  ],
  entryComponents: [],
})
export class NoticerMainModule { }

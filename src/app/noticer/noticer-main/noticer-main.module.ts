import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatDialogModule, MatProgressSpinnerModule, MatExpansionModule, MatListModule, MatFormFieldModule, MatSelectModule, MatGridListModule } from '@angular/material';
import { CalendarModule, GrowlModule, DialogModule, MultiSelectModule, DropdownModule, ConfirmDialogModule } from "primeng/primeng";
import { NoticerMainComponent } from './noticer-main.component';
import { NoticerMainRoutingModule } from './noticer-main-routing.module';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MenuMobileComponent } from './menu-mobile/menu-mobile.component';
import { RightMenuComponent } from './right-menu/right-menu.component';
import { LinkifyPipe } from '../../shared/pipes/linkify.pipe';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    NoticerMainRoutingModule,
    MatListModule,
    MatFormFieldModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    MatGridListModule,
    ConfirmDialogModule,
    NgbModule.forRoot()
  ],
  declarations: [
    NoticerMainComponent,
    SideMenuComponent,
    RightMenuComponent,
    MenuMobileComponent,
    LinkifyPipe
  ],
  entryComponents: [],
})
export class NoticerMainModule { }

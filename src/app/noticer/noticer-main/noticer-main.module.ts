import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatFormFieldModule, MatGridListModule, MatListModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, ConfirmDialogModule, DropdownModule, MultiSelectModule, SidebarModule } from "primeng/primeng";
import { LinkifyPipe } from '../../shared/pipes/linkify.pipe';
import { MenuMobileComponent } from './menu-mobile/menu-mobile.component';
import { NoticerMainRoutingModule } from './noticer-main-routing.module';
import { NoticerMainComponent } from './noticer-main.component';
import { RightMenuComponent } from './right-menu/right-menu.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

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
    SidebarModule,
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

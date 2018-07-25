import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatDialogModule, MatProgressSpinnerModule, MatExpansionModule, MatListModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { CalendarModule, GrowlModule, DialogModule, MultiSelectModule } from "primeng/primeng";
import { NoticerMainComponent } from './noticer-main.component';
import { NoticerMainRoutingModule } from './noticer-main-routing.module';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MenuMobileComponent } from './menu-mobile/menu-mobile.component';
import { RightMenuComponent } from './right-menu/right-menu.component';

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
    NgbModule.forRoot()
  ],
  declarations: [
    NoticerMainComponent,
    SideMenuComponent,
    RightMenuComponent,
    MenuMobileComponent
  ],
  entryComponents: [],
})
export class NoticerMainModule { }

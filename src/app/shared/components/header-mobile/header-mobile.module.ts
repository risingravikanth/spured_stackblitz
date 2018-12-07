import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from 'primeng/primeng';
import { SideMenuMobileComponent } from './side-menu-mobile/side-menu-mobile.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    CommonModule,
    RouterModule,
    NgbModule.forRoot(),
    DropdownModule,
    RouterModule,
  ],
  declarations: [
    SideMenuMobileComponent
  ],
  entryComponents: [],
  exports:[SideMenuMobileComponent]
})
export class HeaderMobileModule { }

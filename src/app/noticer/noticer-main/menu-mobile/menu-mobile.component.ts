import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidator } from '../../../shared/others/custom.validator';
import { CommonService } from '../../../shared/services/common.service';
import { MobileDetectionService } from '../../../shared/services/mobiledetection.service';

@Component({
  selector: 'menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrls: ['./menu-mobile.component.css'],
  providers: [CustomValidator],
  // animations: [routerTransition()]
})
export class MenuMobileComponent implements OnInit {

  public isMobile: boolean;
  constructor(private router: Router, private formbuilder: FormBuilder, private commonService: CommonService, private customValidator: CustomValidator, private mobileService: MobileDetectionService) { }
  ngOnInit() {
    this.isMobile = this.mobileService.isMobile();
    if (!this.isMobile) {
      this.router.navigate(['noticer']);
    } else {
      console.log("side menu mobile");
    }
  }
}

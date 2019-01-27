import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  providers: [MobileDetectionService],
  // animations: [routerTransition()]
})
export class HelpComponent implements OnInit {

  public isMobile: boolean;
  constructor(private mobile: MobileDetectionService) { }

  ngOnInit() {
    this.isMobile = this.mobile.isMobile();
  }

}

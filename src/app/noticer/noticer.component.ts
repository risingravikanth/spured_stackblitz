import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MobileDetectionService } from '../shared/services/mobiledetection.service';

@Component({
    selector: 'app-noticer',
    templateUrl: './noticer.component.html',
    styleUrls: ['./noticer.component.scss']
})
export class NoticerComponent implements OnInit {

    constructor(public router: Router, public mobileService: MobileDetectionService) { }

    public isMobile: boolean;

    ngOnInit() {
       this.isMobile = this.mobileService.isMobile();
    }

}

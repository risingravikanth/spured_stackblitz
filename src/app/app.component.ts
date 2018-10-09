import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MobileDetectionService } from './shared';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public isMobile:boolean;
    constructor(private mobileService: MobileDetectionService) { }

    ngOnInit(): void {
        this.isMobile = this.mobileService.isMobile();
    }
}

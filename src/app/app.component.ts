import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { MobileDetectionService } from './shared';
import { Title } from '@angular/platform-browser';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public isMobile:boolean;
    constructor(private mobileService: MobileDetectionService, private titleService: Title) { }

    ngOnInit(): void {
        this.isMobile = this.mobileService.isMobile();
    }

    public setTitle( newTitle: string) {
        this.titleService.setTitle( newTitle );
      }
}

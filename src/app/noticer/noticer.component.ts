import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-noticer',
    templateUrl: './noticer.component.html',
    styleUrls: ['./noticer.component.scss']
})
export class NoticerComponent implements OnInit {

    constructor(public router: Router) { }

    ngOnInit() {
       
    }

}

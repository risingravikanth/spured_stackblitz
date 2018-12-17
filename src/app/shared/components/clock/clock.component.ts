import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ui-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {
   
  today: any = Date.now();
  
  constructor() { 
  	setInterval(() => {
          this.today = new Date();
    }, 1);
  }



  ngOnInit() {
  }

}

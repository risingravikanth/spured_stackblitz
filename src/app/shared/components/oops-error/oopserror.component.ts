import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-oopserror',
  templateUrl: './oopserror.component.html',
  styleUrls: ['./oopserror.component.css']
})
export class OopsErrorComponent implements OnInit {

  @Input() displayObject : any;
  public errorType : any = "danger";
  public messageText : any = "Opps!";
  public messageContent : any = "No Posts Available.";

  constructor() { }

  ngOnInit() {
  	if(this.displayObject != undefined && this.displayObject != null){
 		if(this.displayObject.type != undefined && this.displayObject.type != null){
 			this.errorType = this.displayObject.type;
 		}
 		if(this.displayObject.message != undefined && this.displayObject.message != null){
 			if(this.displayObject.message == "underMaintenance"){
 				this.messageText = "Sorry!"
 				this.messageContent = "Curreclty this page under maintence so please try after some time."
 			}
 			
 		}
 	}
  }

}

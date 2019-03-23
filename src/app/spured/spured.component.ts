import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MobileDetectionService } from '../shared/services/mobiledetection.service';

 

@Component({
    selector: 'spured',
    templateUrl: './spured.component.html',
    styleUrls: ['./spured.component.scss']
})
export class SpuredComponent implements OnInit {

    constructor(public router: Router, 
    			public mobileService: MobileDetectionService,
    			) { }

    public isMobile: boolean;

    ngOnInit() {
       this.isMobile = this.mobileService.isMobile();

      
 	  /* let token :any = this.jwtService.getToken();
 	   this.cookies.put('auth_token_noticer', token);
       this.cookies.put('auth_token_noticer_HARDCODED', "HARD COEDED IN NOTICER COMPOENT");



		console.log("auth_token_noticer ", this.cookies.get('auth_token_noticer'));
		console.log("auth_token_noticer_HARDCODED ", this.cookies.get('auth_token_authHARDCODED'));*/

			/*let token :any = this.jwtService.getToken();
			token = token.replace(/"/g, '\'');
			let obj :any = {
				token : token
			};

			this.cookies.put('some_cookie2', 'some_cookie2');
			this.cookies.putObject('auth_token', obj);
			this.cookies.put('auth_token_noticer', token);
       		this.cookies.put('auth_token_noticer_HARDCODED', 'HARD COEDED IN NOTICER COMPOENT');
			
			console.log("In side of noticer component NGONINIT");
			console.log(this.cookies.getAll(), ' => some_cookie2 & auth_token');


			 this.authService.setCookie('ravi_kanth','ravikanth_noticer');
        	 this.authService.setCookie("ravi_kanth1",this.authService.getAuth("ravi_kanth1"));


        	 let token = this.authService.getAuth("ravi_kanth1");
        	 console.log("token form auth service token ",token)

        	this.authService.setCookie("double_quote","double_quote_value");

			console.log(this.authService.getAuth('ravi_kanth'), ' => ravi_kanth ');
			console.log(this.authService.getAuth('ravi_kanth1'), ' => ravi_kanth1 ');
			console.log(this.authService.getAuth('some_cookie'), ' => some_cookie ');


			console.log(this.authService.getAuth("ravi_kanth5"), ' => ravi_kanth5 ');
			console.log(this.authService.getAuth("ravi_kanth6"), ' => ravi_kanth6 ');


			console.log(this.authService.getAuth("double_quote"), ' => double_quote ');*/


			
     }

}

import { Injectable, Injector, PLATFORM_ID ,Inject } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JwtService } from '../services/jwt.service';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as constants from '../others/constants';
import { CustomCookieService } from '../services/cookie.service';



import { isPlatformServer } from '@angular/common';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private isServer: boolean;

    constructor(
        private router: Router, private injector: Injector, private jwtService: JwtService,
        private customCookieService:CustomCookieService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private authService : AuthService

    ) { 

         this.isServer = isPlatformServer(platformId);
     }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let restUrl:string;
        let auth_token : any = "";
        let tracking_id : any ="";
        let rawCookiesAry :any = [];
        let rawCookiesStr :any = "";

        if(constants.isLive){
            restUrl = constants.REST_API_URL_NODE;
        } else {
            restUrl = constants.REST_API_URL;
        }

        if(this.isServer){
            const reqObj: any = this.injector.get('REQUEST');
            const rawCookies = !!reqObj.headers['cookie'] ? reqObj.headers['cookie'] : '';

            rawCookiesStr = rawCookies;
            if(rawCookiesStr != null && rawCookiesStr != undefined)
                rawCookiesAry = rawCookies.split(';');
            
            if(rawCookiesAry.length >0){
                for(let i=0; i< rawCookiesAry.length; i++){
                    let cookieObj = rawCookiesAry[i];
                    
                    if( cookieObj != undefined && cookieObj.indexOf("tracking_id=") != -1){
                        // tracking id from cookies
                       tracking_id = cookieObj;
                       tracking_id = tracking_id.replace("tracking_id=","");
                    }

                    if(cookieObj != undefined && cookieObj.indexOf("Authorization=") != -1){
                        // Authorization from cookies
                       auth_token = cookieObj;
                       auth_token = auth_token.replace("Authorization=","");
                     }
                }
            }
           
            console.log("getting is Server tracking_id",tracking_id);
          
             req = req.clone({
                url: `${restUrl + req.url}`,
                setHeaders: {
                    'Authorization': `${auth_token}`,
                    'tracking-id': `${tracking_id}`
                }
            })


        }else{
            req = req.clone({
                url: `${restUrl + req.url}`,
                setHeaders: {
                    'Authorization': `${this.jwtService.getToken()}`,
                    'tracking-id': `${this.customCookieService.getTrackId()}`
                }
            });
        }
        
 
        return next.handle(req).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {

                // do stuff with response if you want
                 if(rawCookiesAry.length >0){
                    for(let i=0; i< rawCookiesAry.length; i++){
                        let cookieObj = rawCookiesAry[i];
                        
                        if( cookieObj != undefined && cookieObj.indexOf("tracking_id=") == -1){
                            // Need to set tracking id from headers
                            this.authService.setCookie("tracking_id",event.headers.get("tracking-id"));
                            this.customCookieService.saveTrackId(event.headers.get("tracking-id"));

                            console.log("setting in handle event.headers.get('tracking-id')",event.headers.get("tracking-id"));
                        }
                    }
                }else if((rawCookiesStr == null || rawCookiesStr == "") && event.headers.get("tracking-id") != null){
                    this.authService.setCookie("tracking_id",event.headers.get("tracking-id"));
                    this.customCookieService.saveTrackId(event.headers.get("tracking-id"));

                    console.log("setting in handle event.headers.get('tracking-id')",event.headers.get("tracking-id"));
                }

                


                /*if(!this.customCookieService.isTrackIdAvailable() || this.customCookieService.getTrackId() == null){
                    console.log("TrackingId in interceptor: " + event.headers.get("tracking-id"));
                }*/

                console.log("resBody in interceptor:");
                if(event && event.body && event.body.info && event.body.info == "Expired token"){
                    console.log(event.body.info)
                    this.authService.purgeAuth();
                    this.router.navigate(['/login'], { queryParams: { 'status': 'access_denied' } })
                }
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    //const auth = this.injector.get(AuthService);
                    // auth.attemptLogout(auth.getCurrentUser());
                    this.authService.purgeAuth();
                    this.router.navigate(['/login'], { queryParams: { 'status': 'access_denied' } });
                }
            }
        });;
    }
}
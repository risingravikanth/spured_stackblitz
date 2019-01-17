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

    ) { 

         this.isServer = isPlatformServer(platformId);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let restUrl:string;
        let auth_token : any = "";
        let rawCookiesAry :any = [];

        if(constants.isLive){
            restUrl = constants.REST_API_URL_NODE;
        } else {
            restUrl = constants.REST_API_URL;
        }

        if(this.isServer){
            const reqObj: any = this.injector.get('REQUEST');
            const rawCookies = !!reqObj.headers['cookie'] ? reqObj.headers['cookie'] : '';

            rawCookiesAry = rawCookies.split(';');
            
            if(rawCookiesAry.length >0){
                if(rawCookiesAry[0] != undefined && rawCookiesAry[0].indexOf("tracking-id=") != -1){
                    // tracking id from cookies
                }

                if(rawCookiesAry[1] != undefined && rawCookiesAry[1].indexOf("Authorization=") != -1){
                    // Authorization from cookies
                   auth_token = rawCookiesAry[1];
                   auth_token = auth_token.replace("Authorization=","");
                   console.log(auth_token)
                }
            }
           
          
             req = req.clone({
                url: `${restUrl + req.url}`,
                setHeaders: {
                    'Authorization': `${auth_token}`,
                    'tracking-id': `${this.customCookieService.getTrackId()}`
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
                if(!this.customCookieService.isTrackIdAvailable() || this.customCookieService.getTrackId() == null){
                    console.log("TrackingId in interceptor: " + event.headers.get("tracking-id"));
                    this.customCookieService.saveTrackId(event.headers.get("tracking-id"));
                }
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    const auth = this.injector.get(AuthService);
                    // auth.attemptLogout(auth.getCurrentUser());
                    auth.purgeAuth();
                    this.router.navigate(['/login'], { queryParams: { 'status': 'access_denied' } });
                }
            }
        });;
    }
}
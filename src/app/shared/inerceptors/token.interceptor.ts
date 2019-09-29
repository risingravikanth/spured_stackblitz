import { isPlatformServer } from '@angular/common';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';
import * as constants from '../others/constants';
import { AuthenticationService } from '../services/auth.service';
import { CustomCookieService } from '../services/cookie.service';
import { JwtService } from '../services/jwt.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    private isServer: boolean;

    constructor(
        private router: Router, private injector: Injector, private jwtService: JwtService,
        private customCookieService: CustomCookieService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private authService: AuthenticationService
    ) {
        this.isServer = isPlatformServer(platformId);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let restUrl: string;
        let auth_token: any = "";
        let tracking_id: any = "";
        let rawCookiesAry: any = [];
        let rawCookiesStr: any = "";

        
        /* CHANGED :: Using enviroment we defined REST_API_URL in both environment.ts & environment.prod.ts files 
            ng serve uses in envronment.ts file REST_API_URL
            npm run build:ssr uses in environment.prod.ts file REST_API_URL
            old code: 
            if (this.router.url.indexOf("spured.com") != -1) {
                restUrl = constants.REST_API_URL_PROD;
            } else {
                restUrl = constants.REST_API_URL_QA;
            }
        */
        
        restUrl = environment.REST_API_URL;
 
        if (this.isServer) {
            const reqObj: any = this.injector.get('REQUEST');
            const rawCookies = !!reqObj.headers['cookie'] ? reqObj.headers['cookie'] : '';

            rawCookiesStr = rawCookies;
            if (rawCookiesStr != null && rawCookiesStr != undefined)
                rawCookiesAry = rawCookies.split(';');

            if (rawCookiesAry.length > 0) {
                for (let i = 0; i < rawCookiesAry.length; i++) {
                    let cookieObj = rawCookiesAry[i];

                    if (cookieObj != undefined && cookieObj.indexOf("tracking_id=") != -1) {
                        // tracking id from cookies
                        tracking_id = cookieObj;
                        tracking_id = tracking_id.replace("tracking_id=", "");
                    }

                    if (cookieObj != undefined && cookieObj.indexOf("Authorization=") != -1) {
                        // Authorization from cookies
                        auth_token = cookieObj;
                        auth_token = auth_token.replace("Authorization=", "");
                    }
                }
            }

            console.log("getting tracking_id from rawCookies when isserver is True", tracking_id);

            req = req.clone({
                url: `${restUrl + req.url}`,
                setHeaders: {
                    'Authorization': `${auth_token}`,
                    'tracking-id': `${tracking_id}`
                }
            })


        } else {
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

                console.log("get tracking id form event headers ",event.headers.get("tracking-id"))
                console.log("get tracking id form event headers ",event.headers.get("tracking_id"))
                console.log("get tracking id form event headers ",event.headers.get("Tracking_id"))
                
                // do stuff with response if you want
                if (rawCookiesAry.length > 0) {
                    for (let i = 0; i < rawCookiesAry.length; i++) {
                        let cookieObj = rawCookiesAry[i];

                        if (cookieObj != undefined && cookieObj.indexOf("tracking_id=") == -1) {
                            // Need to set tracking id from headers
                            this.authService.setCookie("tracking_id", event.headers.get("tracking_id"));
                            this.customCookieService.saveTrackId(event.headers.get("tracking_id"));

                            //console.log("setting in handle event.headers.get('tracking-id')", event.headers.get("tracking-id"));
                        }
                    }
                } else if ((rawCookiesStr == null || rawCookiesStr == "") && event.headers.get("tracking_id") != null) {
                    this.authService.setCookie("tracking_id", event.headers.get("tracking_id"));
                    this.customCookieService.saveTrackId(event.headers.get("tracking_id"));

                    //console.log("setting in handle event.headers.get('tracking-id')", event.headers.get("tracking-id"));
                }




                /*if(!this.customCookieService.isTrackIdAvailable() || this.customCookieService.getTrackId() == null){
                    console.log("TrackingId in interceptor: " + event.headers.get("tracking-id"));
                }*/

                //console.log("resBody in interceptor:");
                if (event && event.body && event.body.info && event.body.info == "Expired token") {
                    //console.log(event.body.info)
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
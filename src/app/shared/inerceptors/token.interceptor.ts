import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JwtService } from '../services/jwt.service';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as constants from '../others/constants';
import { CustomCookieService } from '../services/cookie.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private router: Router, private injector: Injector, private jwtService: JwtService,
        private customCookieService:CustomCookieService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let restUrl:string;
        if(constants.isLive){
            restUrl = constants.REST_API_URL_NODE;
        } else {
            restUrl = constants.REST_API_URL;
        }
        req = req.clone({
            url: `${restUrl + req.url}`,
            setHeaders: {
                'Authorization': `${this.jwtService.getToken()}`,
                'tracking-id': `${this.customCookieService.getTrackId()}`
            }
        })
        return next.handle(req).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
                if(!this.customCookieService.isTrackIdAvailable()){
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
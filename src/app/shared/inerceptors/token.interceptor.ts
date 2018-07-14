import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { JwtService } from '../services/jwt.service';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as constants from '../others/constants';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        private router: Router, private injector: Injector, private jwtService: JwtService
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
                Authorization: `${this.jwtService.getToken()}`
            }
        })
        return next.handle(req).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
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
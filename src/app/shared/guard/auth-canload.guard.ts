import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CurrentUserService } from '../services/currentUser.service';

@Injectable()
export class AuthCanLoadGuard implements CanLoad {
    constructor(private router: Router, private CurrentUserService: CurrentUserService) { }

    canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
        if (this.CurrentUserService.checkValidUser()) {
            return true;
        } else {
            this.router.navigate(['/login'], { queryParams: { returnUrl: route.path } });
            return false;
        }
    }
}

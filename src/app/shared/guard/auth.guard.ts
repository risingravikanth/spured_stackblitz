import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { CurrentUserService } from '../services/currentUser.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private CurrentUserService: CurrentUserService) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        if (this.CurrentUserService.checkValidUser()) {
            return true;
        } else {
            this.router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}

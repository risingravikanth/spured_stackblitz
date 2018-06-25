import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../models/user.model';
import { CurrentUserService } from '../services/currentUser.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private CurrentUserService: CurrentUserService) { }

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        if (this.CurrentUserService.checkValidUser()) {
            return true;
        } else {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}

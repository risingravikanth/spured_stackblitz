import { JwtService } from './jwt.service';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable()
export class CurrentUserService {

    constructor(private jwtService:JwtService) { }
    setCurrentUser(user: User) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
    getCurrentUser(): User {
        let currentUser: User;
        currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        return currentUser;
    }
    deleteCurrentUser() {
        sessionStorage.removeItem('currentUser');
    }
    checkValidUser(): boolean {
        if (sessionStorage.getItem('currentUser') && this.jwtService.getToken()) {
            return true;
        } else {
            return false;
        }
    }
    setRole(role) {
        sessionStorage.setItem('roles', JSON.stringify(role));
    }
    getRole() {
        return JSON.parse(sessionStorage.getItem('roles'));
    }
    deleteRole() {
        sessionStorage.removeItem('roles');
    }
}
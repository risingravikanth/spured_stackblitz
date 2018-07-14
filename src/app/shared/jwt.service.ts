import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {

    constructor() { }
    setToken(token: any) {
        localStorage.setItem("Authorization", token);
    }
    deleteToken() {
        localStorage.removeItem("Authorization");
    }
    getToken(){
        return localStorage.getItem("Authorization");
    }
}
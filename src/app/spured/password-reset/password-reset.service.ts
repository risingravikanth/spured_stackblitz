import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class PasswordResetService {
    constructor(private httpClient: HttpClient) { }

    sendResetPasswordMail(body: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/profile/sendresetpassword";
        return this.httpClient.post(url, JSON.stringify(body), { headers: headers });
    }
    updatePassword(body: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/profile/resetpassword";
        return this.httpClient.post(url, JSON.stringify(body), { headers: headers });
    }


    handleError(error: Response) {
        // console.error(error);
        return Observable.throw(error);
    }

}
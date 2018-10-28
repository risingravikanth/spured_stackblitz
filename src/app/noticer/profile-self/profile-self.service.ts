import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Observable";


@Injectable()
export class SelfProfileService {
    constructor(private httpClient: HttpClient) { }


    handleError(error: Response) {
        // console.error(error);
        return Observable.throw(error);
    }

    getUserInfo(userId: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/profile/getprofile";
        let body = { userId: userId }
        return this.httpClient.post(url, body, { headers: headers}).catch(this.handleError);
    }

}
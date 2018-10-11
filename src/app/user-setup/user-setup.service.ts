import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Headers, RequestOptions, RequestMethod } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserSetUpService {
    constructor(private httpClient: HttpClient) { }

    saveUser(body: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/profile/createprofile";
        return this.httpClient.post(url, JSON.stringify(body), { headers: headers });
    }

}
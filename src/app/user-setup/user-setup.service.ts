import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Headers, RequestOptions, RequestMethod } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserSetUpService {
    constructor(private httpClient: HttpClient) { }

    saveUserSetUp(body: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url =  "/users/signupSetup";
        return this.httpClient.post(url, JSON.stringify(body), { headers: headers });
    }

    saveUserSetUpWithImage(formData, id: any) {
        let headers = new HttpHeaders().set('enctype', 'multipart/form-data').set('Accept', 'application/json');
        // .set('enctype', 'multipart/form-data');
        return this.httpClient.post( "/users/signSetupWithImage/" + id, formData, { headers: headers});
    }

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";

@Injectable()
export class SettingsService {
    constructor(private httpClient: HttpClient) { }


    handleError(error: Response) {
        // console.error(error);
        return Observable.throw(error);
    }


    updatePassword(body: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/profile/updatepassword";
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

}
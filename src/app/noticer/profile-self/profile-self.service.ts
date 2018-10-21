import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";

import * as constant from '../../shared/others/constants'

@Injectable()
export class SelfProfileService {
    constructor(private httpClient: HttpClient) { }


    handleError(error: Response) {
        // console.error(error);
        return Observable.throw(error);
    }

    getUserInfo(){
        let url = constant.REST_API_URL + "/profile/myinfo/getmyinfo";
        return this.httpClient.get(url).catch(this.handleError);
    }

}
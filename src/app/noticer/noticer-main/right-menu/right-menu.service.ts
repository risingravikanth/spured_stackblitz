import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";

@Injectable()
export class SideMenuService {
    constructor(private httpClient: HttpClient) { }
    
    handleError(error: Response) {
        return Observable.throw(error);
    }

}
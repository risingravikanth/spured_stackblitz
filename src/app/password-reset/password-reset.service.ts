import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class UserProfileService {
    constructor(private httpClient: HttpClient) { }


    handleError(error: Response) {
        // console.error(error);
        return Observable.throw(error);
    }

}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class AdminService {
    constructor(private httpClient: HttpClient) { }

    getAdminInstitute() {
        let url = "/boards/getinstituteidsforadminids";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get(url, { headers: headers }).catch(this.handleError);
    }
    

    handleError(error: Response) {
        // console.error(error);
        return Observable.throw(error);
    }
    
}
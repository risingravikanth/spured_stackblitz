import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationsService {
    constructor(private httpClient: HttpClient) { }


    handleError(error: Response) {
        // console.error(error);
        return Observable.throw(error);
    }

    ignoreProperties(data:any){
        let ignoreList = ['createTime', 'text', 'title', 'userId'];
        function replacer(key, value) {
            if (ignoreList.indexOf(key) > -1) return undefined;
            else return value;
        }
        return JSON.parse(JSON.stringify(data, replacer));
    }
    
    getAllMessages(body:any){
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/v2/notifications/get";
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }
    updateNotificationStatus(body:any){
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/v2/notifications/update";
        body = {"data" : body}
        return this.httpClient.post(url, this.ignoreProperties(body), { headers: headers }).catch(this.handleError);
    }
    updateLastRead(body:any){
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/v2/notifications/updatelastread";
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

}
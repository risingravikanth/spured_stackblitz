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

    ignoreProperties(data:any){
        let ignoreList = ['createTime', 'text', 'title', 'userId'];
        function replacer(key, value) {
            if (ignoreList.indexOf(key) > -1) return undefined;
            else return value;
        }
        return JSON.parse(JSON.stringify(data, replacer));
    }


    updatePassword(body: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/profile/updatepassword";
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }
    updateBoardReq(body: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/closedboards/updateboardrequest";
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    getAllRequests(){
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/closedboards/getalladminboardrequests";
        return this.httpClient.get(url, { headers: headers }).catch(this.handleError);
    }

    deleteProfile(body:any){
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/profile/deleteprofile";
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }
    
    updateNotificationSettings(body:any){
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/v2/settings/notifications/update";
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    getNotificationSettings(){
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/v2/settings/notifications/get";
        return this.httpClient.get(url, { headers: headers }).catch(this.handleError);
    }
    
}
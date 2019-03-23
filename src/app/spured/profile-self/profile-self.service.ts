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

    isValidToken(){
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/profile/isvalidtoken";
        return this.httpClient.get(url, { headers: headers }).catch(this.handleError);
    }

    getUserInfo(userId: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/profile/getprofile";
        let body = { userId: userId }
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    saveEditProfile(body: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/profile/updateprofile";
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    uploadImage(file) {
        let url = "/v2/upload/postimage";
        // let headers = new HttpHeaders().set("Content-Type", "multipart/form-data");
        return this.httpClient.post(url, file).catch(this.handleError);
    }

}
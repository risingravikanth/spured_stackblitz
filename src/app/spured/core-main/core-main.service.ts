import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { TransferState } from '@angular/platform-browser';
import { Observable } from "rxjs/Observable";
import * as constants from '../../shared/others/constants';

@Injectable()
export class CoreMainService {
    constructor(private httpClient: HttpClient, private state: TransferState) { }


    handleError(error: Response) {
        return Observable.throw(error);
    }

    ignoreNullValue(x: any) {
        let res = JSON.stringify(x, (key, value) => {
            if (value !== null) return value
        })
        return JSON.parse(res);
    }

    ignoreProperties(data: any) {
        let ignoreList = ['_type1', 'postText'];
        function replacer(key, value) {
            if (ignoreList.indexOf(key) > -1) return undefined;
            else return value;
        }
        return JSON.parse(JSON.stringify(data, replacer));
    }


    saveVehicleOffRoad(data: any) {

        let ignoreList = ['reasonVO', 'listOfReasons', 'baseLocationVO'];
        function replacer(key, value) {
            if (ignoreList.indexOf(key) > -1) return undefined;
            else return value;
        }
        data = JSON.stringify(data, replacer);

        let url = "/api/vehicleOffRoad/saveVehicleOffRoad";

        return this.httpClient.post(url, JSON.parse(data)).catch(this.handleError);
    }

    getDist(value) {
        let url = "/api/address/getDistricts";
        let params = { params: new HttpParams().set('stateId', value) };
        return this.httpClient.get(url, params).catch(this.handleError);
    }

    getPostsList(body: any) {
        let url: string;
        let reqBody: any = { section: null, category: null, model: null, page: null };
        url = "/v2/post/get";
        reqBody = body;
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        const myData = this.httpClient.post(url, this.ignoreNullValue(reqBody), { headers: headers }).catch(this.handleError);
        return myData;
    }

    createPost(body: any) {
        let url: string;
        let reqBody: any = { type: null, _type: null, category: null, model: null, post: null };
        url = "/v2/post/create";
        reqBody = body;
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        reqBody = this.ignoreProperties(reqBody);
        return this.httpClient.post(url, this.ignoreNullValue(reqBody), { headers: headers }).catch(this.handleError);
    }

    getCommentsByPostId(body: any) {
        let url: string;
        let reqBody: any = { section: null, category: null, model: null, page: null };
        url = "/v2/comment/get";
        reqBody = body;
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, JSON.stringify(reqBody), { headers: headers }).catch(this.handleError);
    }

    createComment(body: any) {
        let url: string;
        let reqBody: any = { type: null, _type: null, category: null, model: null, post: null };
        url = "/v2/comment/create";
        reqBody = body;
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, JSON.stringify(reqBody), { headers: headers }).catch(this.handleError);
    }

    upload(file,fileObj) {
        let url = "/v2/upload/file";
        if(fileObj.type === "image/gif" || fileObj.type === "image/jpeg" || 
            fileObj.type === "image/jpg" ||  fileObj.type === "image/png"){
             url = "/v2/upload/postimage";
        }
        // let headers = new HttpHeaders().set("Content-Type", "multipart/form-data");
        return this.httpClient.post(url, file).catch(this.handleError);
    }



    deletePost(body: any) {
        let url = "/v2/post/delete";
        return this.httpClient.post(url, body).catch(this.handleError);
    }

    saveEditPost(body: any) {
        let url = "/v2/post/update";
        return this.httpClient.post(url, body).catch(this.handleError);
    }


    getPostDetailsById(postId, type) {
        let url = "/v2/post/get";

        let body = {
            "context": {
                "section": type
            },
            "data": {
                "postId": postId
            }
        }

        return this.httpClient.post(url, body).catch(this.handleError);
    }

    reportIssue(body: any) {
        let url = "/request/reportissue";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    deleteComment(body: any) {
        let url = "/v2/comment/delete";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    createLike(body: any) {
        let url = "/v2/action/vote/create";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    cancelLike(body: any) {
        let url = "/v2/action/vote/delete";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    createFavorite(body: any) {
        let url = "/v2/action/favorite/create";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    cancelFavorite(body: any) {
        let url = "/v2/action/favorite/delete";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    createReport(body: any) {
        let url = "/v2/action/report/create";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    getSelfActivity(body: any) {
        let url = "/v2/activity/get";
        return this.httpClient.post(url, body).catch(this.handleError);
    }
}
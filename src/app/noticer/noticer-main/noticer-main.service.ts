import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { TransferState } from '@angular/platform-browser';
import { Observable } from "rxjs/Observable";
import * as constants from '../../shared/others/constants';

@Injectable()
export class NoticerMainService {
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
        let reqBody: any = { type: null, category: null, model: null, page: null };
        if (constants.isLive) {
            url = "/api/getPosts";
            reqBody.type = body.context.type;
            reqBody.category = body.data.category;
            reqBody.model = body.data.model;
            reqBody.page = body.pagination.offset;
        } else {
            url = "/v2/post/get";
            reqBody = body;
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        const myData =  this.httpClient.post(url, this.ignoreNullValue(reqBody), { headers: headers }).catch(this.handleError);
        return myData;
    }

    createPost(body: any) {
        let url: string;
        let reqBody: any = { type: null, _type: null, category: null, model: null, post: null };
        if (constants.isLive) {
            url = "/api/createPost";
            reqBody.type = body.context.type;
            reqBody._type = body.data._type;
            reqBody.post = body.data.text;
            reqBody.model = body.data.model;
            reqBody.category = body.data.category;
            reqBody.images = body.data.images;
            reqBody.topic = body.data.topic;
            reqBody.website = body.data.website;
            reqBody.contacts = body.data.contacts;
            reqBody.todate = body.data.todate;
            reqBody.fromdate = body.data.fromdate;
        } else {
            url = "/v2/post/create";
            reqBody = body;
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        reqBody = this.ignoreProperties(reqBody);
        return this.httpClient.post(url, this.ignoreNullValue(reqBody), { headers: headers }).catch(this.handleError);
    }

    getCommentsByPostId(body: any) {
        let url: string;
        let reqBody: any = { type: null, category: null, model: null, page: null };
        if (constants.isLive) {
            url = "/api/getComments";
            reqBody.type = body.context.type;
            reqBody.postId = body.context.postId;
            reqBody.page = body.pagination.offset;
        } else {
            url = "/v2/comment/get";
            reqBody = body;
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, JSON.stringify(reqBody), { headers: headers }).catch(this.handleError);
    }

    createComment(body: any) {
        let url: string;
        let reqBody: any = { type: null, _type: null, category: null, model: null, post: null };
        if (constants.isLive) {
            url = "/api/createComment";
            reqBody.type = body.context.type;
            reqBody.postId = body.context.postId;
            reqBody._type = body.data._type;
            reqBody.post = body.data.text;
        } else {
            url = "/v2/comment/create";
            reqBody = body;
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, JSON.stringify(reqBody), { headers: headers }).catch(this.handleError);
    }

    uploadImage(file) {
        let url = "/v2/upload/postimage";
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
                "type": type
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

    createLike(body:any){
        let url = "/v2/action/vote/create";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    cancelLike(body:any){
        let url = "/v2/action/vote/delete";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    createFavorite(body:any){
        let url = "/v2/action/favorite/create";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    cancelFavorite(body:any){
        let url = "/v2/action/favorite/delete";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }

    createReport(body:any){
        let url = "/v2/action/report/create";
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, body, { headers: headers }).catch(this.handleError);
    }
 
    getSelfActivity(body:any) {
        let url = "/v2/activity/get";
        return this.httpClient.post(url, body).catch(this.handleError);
    }
}
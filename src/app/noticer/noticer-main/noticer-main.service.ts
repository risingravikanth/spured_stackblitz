import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from "rxjs/Observable";
import * as constants from '../../shared/others/constants';

@Injectable()
export class NoticerMainService {
    constructor(private httpClient: HttpClient) { }


    handleError(error: Response) {
        return Observable.throw(error);
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
        return this.httpClient.post(url, JSON.stringify(reqBody), { headers: headers }).catch(this.handleError);
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
        return this.httpClient.post(url, JSON.stringify(reqBody), { headers: headers }).catch(this.handleError);
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


    getPostDetailsById(postId, type){
        let url = "/v2/post/get";

        let body = {
            "context" : {
                "type" : type
            },
            "data": {
                "postId" : postId
            }
        }

        return this.httpClient.post(url, body).catch(this.handleError);
    }
}
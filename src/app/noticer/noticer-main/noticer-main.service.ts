import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";
import * as constants from '../../shared/others/constants';

@Injectable()
export class NoticerMainService {
    constructor(private httpClient: HttpClient) { }


    handleError(error: Response) {
        // console.error(error);
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

        return this.httpClient.post(url, JSON.parse(data));
    }


    getDist(value) {
        let url = "/api/address/getDistricts";
        let params = { params: new HttpParams().set('stateId', value) };
        return this.httpClient.get(url, params);
    }

    getFavoriteBoards() {
        let url: string;
        if (constants.isLive) {
            url = "/api/getFavBoards";
        } else {
            url = "/boards/getboardinfobyinstid";
        }
        let data = 1;
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, JSON.stringify(data), { headers: headers });
    }

    createVerbalPost(body: any) {
        let url: string;
        if (constants.isLive) {
            url = "/api/createVerbalPost";
        } else {
            url = "/verbal/post/create";
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, JSON.stringify(body), { headers: headers });
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
        return this.httpClient.post(url, JSON.stringify(reqBody), { headers: headers });
    }

    createPost(body: any) {
        let url: string;
        let reqBody: any = { type: null, _type: null, category: null, model: null, post: null };
        if (constants.isLive) {
            url = "/api/createPost";
            reqBody.type = body.context.type;
            reqBody._type = body.data._type;
            reqBody.category = body.data.category;
            reqBody.model = body.data.model;
            reqBody.post = body.data.text;
        } else {
            url = "/v2/post/create";
            reqBody = body;
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, JSON.stringify(reqBody), { headers: headers });
    }

    getCommentsByPostId(body: any) {
        let url: string;
        let reqBody: any;
        if (constants.isLive) {
            url = "/api/getCommentsByPostId";
        } else {
            url = "/v2/comment/get";
            reqBody = body;
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, JSON.stringify(reqBody), { headers: headers });
    }

    createComment(body: any) {
        let url: string;
        let reqBody: any = { type: null, _type: null, category: null, model: null, post: null };
        if (constants.isLive) {
            url = "/api/createPost";
            reqBody.type = body.context.type;
            reqBody._type = body.data._type;
            reqBody.category = body.data.category;
            reqBody.model = body.data.model;
            reqBody.post = body.data.text;
        } else {
            url = "/v2/comment/create";
            reqBody = body;
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post(url, JSON.stringify(reqBody), { headers: headers });
    }
}
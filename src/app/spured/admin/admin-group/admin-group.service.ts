import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class AdminGroupService {
    constructor(private httpClient: HttpClient) { }

    deleteGroup(body: any) {
        let url = "/groups/delete";
        return this.httpClient.post(url, body).catch(this.handleError);
    }

    addUsersGroup(body: any) {
        let url = "/groups/addusers";
        return this.httpClient.post(url, body).catch(this.handleError);
    }

    removeUsersGroup(body: any) {
        let url = "/groups/removeusers";
        return this.httpClient.post(url, body).catch(this.handleError);
    }
    
    getUsersInGroup(groupId: any) {
        let url = "/groups/getusersingroup/" + groupId;
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get(url, { headers: headers }).catch(this.handleError);
    }
    
    getMyGroups() {
        let url = "/groups/getmygroups";
        let body = {
            "data": {
                "_type": "Group",
                "groupType": "INSTITUTE"
            }
        }
        return this.httpClient.post(url, body).catch(this.handleError);
    }

    getPublicGroups() {
        let url = "/groups/getmygroups";
        let body = {
            "data": {
                "_type": "Group",
                "groupType": "PUBLIC"
            }
        }
        return this.httpClient.post(url, body).catch(this.handleError);
    }

    createGroupInstAdmin(body: any) {
        let url = "/groups/create";
        return this.httpClient.post(url, body).catch(this.handleError);
    }
    
    handleError(error: Response) {
        // console.error(error);
        return Observable.throw(error);
    }
    
}
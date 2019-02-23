import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class AdminService {
    constructor(private httpClient: HttpClient) { }

    createGroup(body: any) {
        let url = "/groups/create";
        this.httpClient.post(url, body).catch(this.handleError);
    }

    deleteGroup(body: any) {
        let url = "/groups/delete";
        this.httpClient.post(url, body).catch(this.handleError);
    }

    addUsersGroup(body: any) {
        let url = "/groups/addusers";
        this.httpClient.post(url, body).catch(this.handleError);
    }

    removeUsersGroup(body: any) {
        let url = "/groups/removeusers";
        this.httpClient.post(url, body).catch(this.handleError);
    }
    
    getUsersInGroup(groupId: any) {
        let url = "/groups/getusersingroup/" + groupId;
        this.httpClient.get(url).catch(this.handleError);
    }
    
    getMyGroups() {
        let url = "/groups/getmygroups";
        let body = {
            "data": {
                "_type": "Group",
                "groupType": "INSTITUTE"
            }
        }
        this.httpClient.post(url, body).catch(this.handleError);
    }
    
    
    getUsersInClosedBoard(boardId: any) {
        let url = "/closedboards/getusersinclosedboard/" + boardId;
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get(url, { headers: headers }).catch(this.handleError);
    }
    
    addUsersInBoard(body: any) {
        let url = "/closedboards/adduserstoboard";
        return this.httpClient.post(url, body).catch(this.handleError);
    }

    removeUsersInBoard(body: any) {
        let url = "/closedboards/removeusersfromboard";
        return this.httpClient.post(url, body).catch(this.handleError);
    }

    handleError(error: Response) {
        // console.error(error);
        return Observable.throw(error);
    }
    
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { makeStateKey, TransferState } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
  })
export class LeftMenuService {
    constructor(private httpClient: HttpClient) { }
     

    handleError(error: Response) {
        return Observable.throw(error);
    }

    getFavBoards() {
        return this.httpClient.get("/favboards/getfavboardslist");
    }
    getAllAvailablePublicGroups() {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get("/groups/getallavailablepublicgroups", {headers:headers});
    }
    getBoardsByInstidDeptId(instId: any, deptId: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get("/boards/getclosedboardinfo/institute/" + instId + "/department/" + deptId, { headers: headers });
    }
    getUserClosedBoards(): Observable<any> {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get("/closedboards/getalluserclosedboards", { headers: headers });
    }
    getAdminClosedBoards(): Observable<any> {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get("/closedboards/getallboardsasadmin", { headers: headers });
    }
    getAllStates() {
        return this.httpClient.get("/institutes/getallstates");
    }
    getInstByState(value: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get("/institutes/getinstitutesbystate/" + value, { headers: headers });
    }
    getDepartmentsByInst(value: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get("/institutes/department/" + value, { headers: headers });
    }
    getBatchesByDepartment(value: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get("/institutes/department/" + value, { headers: headers });
    }
    addBoardRequest(url:any, body: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.post("/closedboards/requesttoaddclosedboards", body , { headers: headers });
    }

    getPendingBoardsInfo(){
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/closedboards/getpendingboardrequests";
        return this.httpClient.post(url, { headers: headers });
    }

    joinInPublicGroup(req:any){
        let body = {
            "data" : {
                id:req.id,
                _type:"Group",
                groupType : "PUBLIC"
            }
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/groups/joingroup";
        return this.httpClient.post(url, body);
    }

}
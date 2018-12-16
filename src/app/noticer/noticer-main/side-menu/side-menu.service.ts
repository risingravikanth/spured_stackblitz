import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class SideMenuService {
    constructor(private httpClient: HttpClient) { }

    handleError(error: Response) {
        return Observable.throw(error);
    }

    getFavBoards() {
        return this.httpClient.get("/favboards/getfavboardslist");
    }
    getBoardsByInstidDeptId(instId: any, deptId: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get("/boards/getclosedboardinfo/institute/" + instId + "/department/" + deptId, { headers: headers });
    }
    getUserClosedBoards() {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        return this.httpClient.get("/closedboards/getalluserclosedboards", { headers: headers });
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

}
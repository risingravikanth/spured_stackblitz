import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Observable } from "rxjs/Observable";

@Injectable()
export class SideMenuService {
    constructor(private httpClient: HttpClient) { }
    
    handleError(error: Response) {
        return Observable.throw(error);
    }

    getFavBoards(){
        return this.httpClient.get("/favboards/getfavboardslist");   
    }
    getAllStates(){
        return this.httpClient.get("/institutes/getallstates");   
    }
    getInstByState(){
        return this.httpClient.get("/institutes/getinstitutesbystate");   
    }
    getBoardsByInst(){
        return this.httpClient.get("/institutes/getinstitutesbystate");   
    }

}
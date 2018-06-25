import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class LocationService {
    constructor(private httpClient: HttpClient) { }
    getState() {
        let url =  "/api/address/getStates";
        return this.httpClient.get(url);
    }
    getDist(value) {
        let url =  "/api/address/getDistricts";
        let params = { params: new HttpParams().set('stateId', value) };
        return this.httpClient.get(url, params);
    }
    getMandal(value) {
        let url =  "/api/address/getMandals";
        let params = { params: new HttpParams().set('districtId', value) };
        return this.httpClient.get(url, params);
    }
    getVillage(value) {
        let url =  "/api/address/getVillages";
        let params = { params: new HttpParams().set('mandalId', value) };
        return this.httpClient.get(url, params);
    }
}
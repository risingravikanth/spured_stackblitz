import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { Reason, Categories, SubCategories, Aggregates } from "../../shared/models/vehicle-offroad.model";
import { Observable } from "rxjs/Observable";

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

    getAllVehicle() {
        let url = "/api/getAllVehicles";
        return this.httpClient.get(url);
    }

    getDist(value) {
        let url = "/api/address/getDistricts";
        let params = { params: new HttpParams().set('stateId', value) };
        return this.httpClient.get(url, params);
    }

    getAllOffRoadVehicles(value: any) {
        let url = "/api/vehicleOffRoad/getAllOffRoadVehicles";
        let params = { params: new HttpParams().set('pageNumber', value) };
        return this.httpClient.get(url, params);
    }

    // getVehiclesByDistrict(value) {
    //     let url = "/api/mappings/getVehiclesUnderDistrict";
    //     let params = { params: new HttpParams().set('districtId', value) };
    //     return this.httpClient.get(url, params);
    // }

    getIssueDetails(issueId) {
        let url = "/api/issue/getIssueDetailsByIssueId";
        let params = { params: new HttpParams().set('issueId', issueId) };
        return this.httpClient.get(url, params);
    }

    getDivisionsUnderDistrict(districtId) {
        let url = "/api/mappings/getAllConfigs";
        let params = { params: new HttpParams().set('districtId', districtId) };
        return this.httpClient.get(url, params);
    }

    getBasestationsUnderDivision(divisionId) {
        let url = "/api/mappings/getEMEConfig";
        let params = { params: new HttpParams().set('configId', divisionId) };
        return this.httpClient.get(url, params);
    }

    getVehiclesUnderBasestation(baseStationId) {
        let url = "/api/mappings/getVehilcesUnderBaseStation";
        let params = { params: new HttpParams().set('baseStationId', baseStationId) };
        return this.httpClient.get(url, params);
    }

    getIssuesOfVehicle(vehicleId){
        let url = "/api/issue/getOpenIssueOfVehicle";
        let params = { params: new HttpParams().set('vehicleId', vehicleId) };
        return this.httpClient.get(url, params);
    }

    getOnroadVehiclesUnderBasestation(baseStationId) {
        let url = "/api/mappings/getOnroadVehilcesUnderBaseStation";
        let params = { params: new HttpParams().set('baseStationId', baseStationId) };
        return this.httpClient.get(url, params);
    }

    getBackupVehiclesUnderBasestation(baseStationId) {
        let url = "/api/mappings/getBackupVehilcesUnderBaseStation";
        let params = { params: new HttpParams().set('baseStationId', baseStationId) };
        return this.httpClient.get(url, params);
    }

    getDivisionByVehicle(vehicleId) {
        let url = "/api/mappings/getDivisionByVehicle";
        let params = { params: new HttpParams().set('vehicleId', vehicleId) };
        return this.httpClient.get(url, params);
    }

}
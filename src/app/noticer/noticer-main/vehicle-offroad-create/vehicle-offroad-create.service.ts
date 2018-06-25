import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { Reason, Categories, SubCategories, Aggregates } from "../../../shared/models/vehicle-offroad.model";
import { Observable } from "rxjs/Observable";

@Injectable()
export class VehicleOffRoadCreateService {
    constructor(private httpClient: HttpClient) { }


    searchReasons(value) {
        let url =  "/api/search/reasonsByName";
        let params = { params: new HttpParams().set('reasonName', value) };
        return this.httpClient.get<Reason[]>(url, params);
    }

    searchAggregates(reasonId, aggregateName) {
        let url =  "/api/search/aggregateByName/"+reasonId;
        let params = { params: new HttpParams().set('aggregateName', aggregateName) };
        return this.httpClient.get<Aggregates[]>(url, params);
    }

    searchCategories(aggregateId, categoryName) {
        let url =  "/api/search/categoriesByName/"+aggregateId;
        let params = { params: new HttpParams().set('categoryName', categoryName) };
        return this.httpClient.get<Categories[]>(url, params);
    }

    searchSubCategories(categoryId, subCategoryName) {
        let url =  "/api/search/subCategoriesByName/"+categoryId;
        let params = { params: new HttpParams().set('subCategoryName', subCategoryName) };
        return this.httpClient.get<SubCategories[]>(url, params);
    }

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

        let url =  "/api/vehicleOffRoad/saveVehicleOffRoad";

        return this.httpClient.post(url, JSON.parse(data));
    }

    getAllVehicle() {
        let url =  "/api/getAllVehicles";
        return this.httpClient.get(url);
    }

    getDist(value) {
        let url =  "/api/address/getDistricts";
        let params = { params: new HttpParams().set('stateId', value) };
        return this.httpClient.get(url, params);
    }

    getAllOffRoadVehicles(value: any){
        let url =  "/api/vehicleOffRoad/getAllOffRoadVehicles";
        let params = { params: new HttpParams().set('pageNumber', value) };
        return this.httpClient.get(url, params);
    }

    getOffRoadReasons(value: any){
        let url =  "/api/vehicleOffRoad/getOffRoadReason";
        let params = { params: new HttpParams().set('offRoadId', value) };
        return this.httpClient.get(url, params);
    }


    getVehiclesByDistrict(value) {
        let url =  "/api/mappings/getVehiclesUnderDistrict";
        let params = { params: new HttpParams().set('districtId', value) };
        return this.httpClient.get(url, params);
    }

    
    getEMEForVehicle(value) {
        let url =  "/api/mappings/getEMEByVehicle";
        let params = { params: new HttpParams().set('vehicleId', value) };
        return this.httpClient.get(url, params);
    }

}
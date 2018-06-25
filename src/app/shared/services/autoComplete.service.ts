import { Injectable } from '@angular/core';

@Injectable()
export class AutoCompleteService {

    constructor() { }


    // mappings for user
    userMapping(control: any, data: any) {

        return control.startWith(null)
            .map(user => user && typeof user === 'object' ? user.firstName : user)
            .map(name => name ? this.filter(name, data) : data.slice());
    }
    filter(name: string, data: any): any[] {
        return data.filter(option =>
            option.firstName.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
    userDisplayFn(user: any): string {
        return user ? user.firstName : user;
    }
    //mapping for parts
    partMapping(control: any, data: any) {

        return control.startWith(null)
            .map(part => part && typeof part === 'object' ? part.itemCode : part)
            .map(name => name ? this.partfilter(name, data) : data.slice());
    }
    partfilter(name: string, data: any): any[] {
        return data.filter(option =>
            option.itemCode.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
    partDisplayFn(part: any): string {
        return part ? part.itemCode : part;
    }

    //mapping for vehicle number
    vehicleMapping(control: any, data: any) {
        return control.startWith(null)
            .map(vehicle => vehicle && typeof vehicle === 'object' ? vehicle.vehicleNumber : vehicle)
            .map(name => name ? this.vehicleFilter(name, data) : data.slice());
    }
    vehicleFilter(name: string, data: any): any[] {
        return data.filter(option =>
            option.vehicleNumber.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
    vehicleDisplayFn(vehicle: any): string {
        if (vehicle != null) {
            return vehicle.vehicleNumber ? vehicle.vehicleNumber : vehicle.trNumber;
        }
    }
    trNumberMapping(control: any, data: any) {
        return control.startWith(null)
            .map(vehicle => vehicle && typeof vehicle === 'object' ? vehicle.trNumber : vehicle)
            .map(name => name ? this.trNumberFilter(name, data) : data.slice());
    }
    trNumberFilter(name: string, data: any): any[] {
        return data.filter(option =>
            option.trNumber.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }
    fabricationVehicleDispFn(vehicle: any): string {
        if (vehicle != null) {
            return vehicle.trNumber ? vehicle.trNumber : vehicle.vehicleNumber;
        }
    }
}
export class Types {
    constructor(vehicleType: string) {
        this.vehicleType = vehicleType;
        this.badge = "new";
    }
    id: number;
    vehicleType: string;
    badge:string;
}
export class SubTypes {
    constructor(vehicleSubType: string) {
        this.subType = vehicleSubType;
        this.badge = "new";
    }
    id: number;
    subType: string;
    typeId:number;
    badge:string;
}
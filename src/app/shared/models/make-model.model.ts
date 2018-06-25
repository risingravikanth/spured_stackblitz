export class Make {
    constructor(makeName: string, makeType: string) {
        this.makeName = makeName;
        this.makeType = makeType;
        this.badge = "new";
    }
    id: number;
    makeName: string;
    makeType: string;
    badge:string;
}
export class Model {
    constructor(modelName: string) {
        this.modelName = modelName;
        this.badge = "new";
    }
    id: number;
    modelName: string;
    makeId:number;
    badge:string;
}
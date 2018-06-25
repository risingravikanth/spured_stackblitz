export class Reason {
    constructor(name: string) {
        this.name = name;
        this.badge = "new";
    }
    id: number;
    name: string;
    badge:string;
}

export class Aggregates {
    constructor(name: string) {
        this.name = name;
        this.badge = "new";
    }
    id: number;
    name: string;
    reasonId: number;
    badge:string;
}

export class Categories {
    constructor(name: string) {
        this.name = name;
        this.badge = "new";
    }
    id: number;
    name: string;
    aggregateId: number;
    badge:string;
}

export class SubCategories {
    constructor(name: string) {
        this.name = name;
        this.badge = "new";
    }
    id: number;
    name: string;
    categoryId: number;
    cost: number;
    badge:string;
}
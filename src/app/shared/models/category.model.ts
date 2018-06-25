export class Category {
    constructor(categoryName: string) {
        this.categoryName = categoryName;
        this.badge = "new";
    }
    id: number;
    categoryName: string;
    badge:string;
}
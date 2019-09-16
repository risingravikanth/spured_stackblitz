export class User {
    id: number;
    email: string;
    imageUrl: string;
    userId: number;
    userName: string;
    token: string;
    params: Array<any>;
    accountType: string;
}

export interface Param {
    id: number;
    param: string;
    value: string;
}
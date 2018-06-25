export class User {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    level: string;
    token: string;
    role: any;
    params: Array<Param>;
}

export interface Param {
    id: number;
    param: string;
    value: string;
}
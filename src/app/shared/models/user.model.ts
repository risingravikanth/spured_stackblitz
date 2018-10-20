export class User {
    id: number;
    email: string;
    profileImageUrl: string;
    userId: number;
    userName: string;
    token: string;
    params: Array<any>;
}

export interface Param {
    id: number;
    param: string;
    value: string;
}
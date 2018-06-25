export interface Role {
    id: number;
    name: string;
    privileges: Privilige[];
    text: string;
}
export interface Privilige {
    id: number;
    name: string;
    text: string;
}
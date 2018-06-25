import { Injectable } from '@angular/core';
import { Role, Privilige } from '../models/role.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PermissionService {

    constructor(
        private httpClient: HttpClient
    ) { }

    getPermissions() {
        let url =  "/api/getCurrentUserRole";
        return this.httpClient.get(url);
    }
}
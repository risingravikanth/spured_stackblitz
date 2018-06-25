import { Injectable } from '@angular/core';
import { User } from './../models/user.model';
import { CurrentUserService } from '../services/currentUser.service';

@Injectable()
export class TimePickerFormat {
    constructor(private service: CurrentUserService) { }
    public getTimeFormat(): string {
            return this.getUserTimeFormat()
    }
    public getUserTimeFormat(): string {
        let currentUser: User = this.service.getCurrentUser();
        let format: string;
        currentUser.params.forEach(param => {
            if (param.param == "timeformat")
                format = param.value.toLocaleLowerCase();
        });
        return format ? format : "24 Hours";
    }
}

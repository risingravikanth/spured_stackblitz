import { Injectable } from '@angular/core';
import { User } from './../models/user.model';
import { CurrentUserService } from '../services/currentUser.service';

@Injectable()
export class DatePickerFormat {
    constructor(private service: CurrentUserService) { }

    public getUserDateFormat(): string {
        let currentUser: User = this.service.getCurrentUser();
        let format: string;
        let dateformatArray: any;
        currentUser.params.forEach(param => {
            if (param.param == "dateformat")
                format = param.value.toLocaleLowerCase();
            //TODO : has to remove this code
            dateformatArray = format.split('/');
            if (dateformatArray[2] == "yyyy") {
                format = format.replace("yyyy", "yy");
            }
        });
        return format ? format : "mm/dd/yy";
    }
    public getCurrentDate(): any {
        let now = new Date();
        // let day = ("0" + now.getDate()).slice(-2);
        // let month = ("0" + (now.getMonth() + 1)).slice(-2);
        // let today = (day) + "-" + (month) + "-" + now.getFullYear();
        // console.log(today);
        return now;
    }
}

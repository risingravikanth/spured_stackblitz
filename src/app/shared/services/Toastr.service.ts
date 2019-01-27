import { Injectable, ViewContainerRef } from "@angular/core";
import { ToastrManager } from 'ng6-toastr-notifications';
declare var toastr:any;
var toastr;
@Injectable()
export class ToastrService{

    constructor(public toastr: ToastrManager) {
     }

    success(message:string, title:string){
        this.toastr.successToastr(title, message);
    }
    error(message:string, title:string){
        this.toastr.errorToastr(title, message);
    }
    warning(message:string, title:string){
        this.toastr.warningToastr(title, message);
    }
    info(message:string){
        this.toastr.infoToastr(message);
    }
}
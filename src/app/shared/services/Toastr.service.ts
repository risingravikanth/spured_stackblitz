import { Injectable } from "@angular/core";
declare var toastr:any;
@Injectable()
export class ToastrService{

    success(message:string, title:string){
        toastr.success(title, message)
    }
    error(message:string, title:string){
        toastr.error(title, message)
    }
    warning(message:string, title:string){
        toastr.warning(title, message)
    }
    info(message:string){
        toastr.info(message)
    }
}
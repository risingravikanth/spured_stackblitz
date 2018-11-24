import { Injectable } from "@angular/core";
declare var toastr:any;
@Injectable()
export class ToastrService{

    success(title:string, message:string){
        toastr.success(title, message)
    }
    error(title:string, message:string){
        toastr.error(title, message)
    }
    warning(title:string, message:string){
        toastr.warning(title, message)
    }
    info(message:string){
        toastr.info(message)
    }
}
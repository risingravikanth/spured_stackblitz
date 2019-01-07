import { Injectable } from "@angular/core";
declare var toastr:any;
var toastr;
@Injectable()
export class ToastrService{

    private toastr :any;

    success(message:string, title:string){
        /*if(toastr){
             toastr.success(title, message);
        }else{
             console.log(title+" : "+message);
        }*/
    }
    error(message:string, title:string){
        /*if(toastr){
              toastr.error(title, message)
        }else{
             console.log(title+" : "+message);
        }*/
    }
    warning(message:string, title:string){
        /*if(toastr){
              toastr.warning(title, message);
        }else{
             console.log(title+" : "+message);
        }*/
    }
    info(message:string){
       
       /* if(toastr){
              toastr.info(message);
        }else{
             console.log(message);
        } */
    }
}
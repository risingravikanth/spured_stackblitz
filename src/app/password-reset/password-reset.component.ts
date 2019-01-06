import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from "primeng/components/common/messageservice";
import { CustomValidator } from '../shared/others/custom.validator';
import { ToastrService } from '../shared/services/Toastr.service';
import { PasswordResetService } from './password-reset.service';

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
  providers: [PasswordResetService, CustomValidator, MessageService, ToastrService]
})
export class PasswordResetComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder, private service: PasswordResetService, private tostr:ToastrService) { }

  PasswordResetForm: FormGroup;

  public emailSent:boolean = false;
  public btnTxt = "Send"
  public emailId:any;

  ngOnInit() {
    this.formInit();
  }


  formInit() {
    this.PasswordResetForm = this.formbuilder.group({
      email: ['', [
        Validators.required,
        Validators.email,
    ]]
    }
    );
  }

  sendPassword(){
    this.btnTxt = "Sending..";
    this.service.sendResetPasswordMail(this.PasswordResetForm.value).subscribe(
      (resData:any) =>{
        if(resData && resData.statusCode == "SUCCESS"){
          this.emailId = this.PasswordResetForm.controls['email'].value;
          this.emailSent = true;
          // this.formInit();
        } else if(resData && resData.info) {
          this.tostr.error("Failed", resData.info);
          this.btnTxt = "Send";
        } else{
          this.btnTxt = "Send";
          this.tostr.error("Failed", "Something went wrong!");
        }
      }
    )
  }

  cancel(){
    this.router.navigate(['/login']);
  }

}

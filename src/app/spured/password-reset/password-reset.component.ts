import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from "primeng/components/common/messageservice";
import { CustomValidator } from '../../shared/others/custom.validator';
import { ToastrService } from '../../shared/services/Toastr.service';
import { PasswordResetService } from './password-reset.service';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';
import { SeoService } from '../../shared';
import { CurrentUserService } from '../../shared/services/currentUser.service';

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
  providers: [PasswordResetService, CustomValidator, MessageService, ToastrService, MobileDetectionService, CurrentUserService, SeoService]
})
export class PasswordResetComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder, private service: PasswordResetService, private tostr: ToastrService,
    private mobile: MobileDetectionService, 
    private seo:SeoService, private userService:CurrentUserService) { }

  PasswordResetForm: FormGroup;

  public emailSent: boolean = false;
  public btnTxt = "Send"
  public emailId: any;
  public isMobile: boolean;
  ngOnInit() {
    this.isMobile = this.mobile.isMobile();
    this.formInit();
    this.seo.generateTags({
      title: 'SpurEd - Spur Encouragement to Education',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'feed-page'
    })
    this.userService.setTitle("SpurEd - Spur Encouragement to Education")
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

  sendPassword() {
    this.btnTxt = "Sending..";
    this.service.sendResetPasswordMail(this.PasswordResetForm.value).subscribe(
      (resData: any) => {
        if (resData && resData.statusCode == "SUCCESS") {
          this.emailId = this.PasswordResetForm.controls['email'].value;
          this.emailSent = true;
          // this.formInit();
        } else if (resData && resData.info) {
          this.tostr.error("Failed", resData.info);
          this.btnTxt = "Send";
        } else {
          this.btnTxt = "Send";
          this.tostr.error("Failed", "Something went wrong!");
        }
      }
    )
  }

  cancel() {
    this.router.navigate(['/login']);
  }

}

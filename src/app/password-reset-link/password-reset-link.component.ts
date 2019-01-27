import { Component, OnInit } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ToastrService } from '../shared/services/Toastr.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordResetService } from '../password-reset/password-reset.service';
import { MobileDetectionService, SeoService } from '../shared';
import { CurrentUserService } from '../shared/services/currentUser.service';
const MY_DATA = makeStateKey('ACCOUNT_ACTIVATION');

@Component({
  selector: 'password-reset-link',
  templateUrl: './password-reset-link.component.html',
  styleUrls: ['./password-reset-link.component.css'],
  providers: [AuthService, ToastrService, PasswordResetService, MobileDetectionService,
    CurrentUserService, SeoService]
})
export class PasswordResetLinkComponent implements OnInit {

  public code: any;
  message: any;
  public tokenDetails: any;
  public isValiUser: boolean = false
  authForm: FormGroup
  public btnTxt = "Update";
  public isMobile: any;
  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private state: TransferState,
    private fb: FormBuilder,
    private service: PasswordResetService,
    private mobile: MobileDetectionService,
    private seo: SeoService,
    private userService: CurrentUserService) {

  }


  ngOnInit() {
    this.isMobile = this.mobile.isMobile();
    this.route.params.subscribe(this.handleParams.bind(this));
    this.initForm();
    this.seo.generateTags({
      title: 'SpurEd - Spur: Give encouragement to Ed: Education',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'feed-page'
    })
    this.userService.setTitle("SpurEd - Spur: Give encouragement to Ed: Education")
  }

  initForm() {
    this.authForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', Validators.required],
      secretId: [null]
    });
  }

  handleParams(params: any) {
    this.code = params['code']
    // this.authForm.controls['secretId'].patchValue(this.code);
  }


  changePassword() {
    this.btnTxt = "Updating..";
    this.authForm.controls['secretId'].patchValue(this.code);
    this.service.updatePassword(this.authForm.value).subscribe(
      (resData: any) => {
        this.btnTxt = "Update";
        if (resData && resData.token) {
          this.tokenDetails = resData;
          this.toastr.success("Success", "Password updated successfully!");
          this.continueTOLogin();
        } else if (resData && resData.statusCode == "ERROR") {
          this.toastr.error("Failed", resData.info);
        } else {
          this.toastr.error("Failed", "Something went wrong!");
        }
      }
    )
  }


  continueTOLogin() {
    if (this.tokenDetails) {
      this.authService.setAuth(this.tokenDetails);
      this.router.navigate(['/feed']);
    }
  }

}

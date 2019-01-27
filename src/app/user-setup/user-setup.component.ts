import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { CustomValidator } from "../shared/others/custom.validator";
import { MobileDetectionService, SeoService } from '../shared/services';
import { CurrentUserService } from '../shared/services/currentUser.service';
import { ToastrService } from '../shared/services/Toastr.service';
import { UserSetUpService } from "./user-setup.service";
@Component({
  selector: 'user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.scss'],
  providers: [CustomValidator, UserSetUpService, MessageService, SeoService, CurrentUserService, ToastrService],
  // animations: [routerTransition()],
})
export class UserSetupComponent implements OnInit {
  imageBase64: any;
  organizationVO: any;
  UserSetUpForm: FormGroup;
  UserDetailsForm: FormGroup;
  OrganizationDetailsForm: FormGroup;
  ConfigurationDetailsForm: FormGroup;
  authForm: FormGroup;
  returnUrl: string;
  public msgs: Message[] = [];
  user: any = {};
  placeholderString = 'Select timezone';
  mapJsonString: string;
  imageShow: boolean;
  public responseData: any = { successResponse: "", failedResponse: "", cancel: "" }
  showPasswordError: boolean = false;
  public image: File;
  loggedUser: any;
  public isMobile:boolean = false;
  public btnText:any = "Submit";
  public isValidUser = false;
  public signUpDone:boolean = false;
  public mailId:any;
  resendBtnTxt = "Resend";
  errorTextMessage: string = '';
  constructor(
    private router: Router,
    private formbuilder: FormBuilder,
    private userSetUpService: UserSetUpService,
    private route: ActivatedRoute,
    private seo: SeoService,
    private userService:CurrentUserService,
    private mobile:MobileDetectionService,
    private toastr:ToastrService
  ) { }

  ngOnInit() {
    this.isMobile = this.mobile.isMobile();
    this.userSetUpForm();
    this.seo.generateTags({
      title: 'Sign up - SpurEd',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'signup-page'
  })
  this.userService.setTitle("Sign up - SpurEd")
    if(this.userService.getCurrentUser()){
      this.isValidUser = true;
    }
  }


  userSetUpForm() {
    this.UserSetUpForm = this.formbuilder.group({
      userName: ["", { validators: [Validators.required] }],
      password: ["", [Validators.required, Validators.minLength(8)] ],
      // matchingPassword: ['', { validators: [Validators.required] }],
      phoneNum: [null],
      email: ["", [
        Validators.required, Validators.email
      ]],
      gender: ["", { validators: [Validators.required] }]
    }
    );
  }

  get fControl() { return this.UserSetUpForm.controls; }

  saveUserSetUp() {
    if (this.UserSetUpForm.invalid) {
      // this.toastr.error("Failed", 'Please fill all the fields!')
      this.errorTextMessage  = 'Please fill all the fields!';
    }
    else {
      this.btnText = "Creating new user.."
      this.userSetUpService.saveUser(this.UserSetUpForm.value).subscribe(
        resData => {
          this.responseData = resData;
          this.btnText = "Submit";
          if (this.responseData.info || this.responseData.statusCode == "ERROR") {
            // this.toastr.error("Failed", this.responseData.info)
            this.errorTextMessage  = this.responseData.info;
          } else if (this.responseData.email) {
            // this.toastr.success("Signup Success", 'Soon you will get confirmation mail!')
            this.signUpDone = true;
            this.mailId = this.responseData.email;
            this.userSetUpForm();
          } else {
            console.log(this.responseData);
          }
        }, error => {
          this.errorTextMessage  = "Something went wrong!";
          // this.toastr.error("Failed", "Something went wrong!")
        }
      );
    }
  }

  redirectLogin() {
    this.router.navigate(['/login']);
  }

  resendActivationMail(){
    this.resendBtnTxt = "Sending..";
    this.userSetUpService.resendMail(this.mailId).subscribe((resData:any) =>
    {
      this.resendBtnTxt = "Resend";
      if(resData && resData.info == "Successfully sent activation again"){
        this.toastr.success("Success", resData.info);
      } else if(resData && resData.info){
        // this.toastr.error("Failed", resData.info);
        this.errorTextMessage  = resData.info;
        
      } else{
        this.errorTextMessage  = "Something went wrong!";
        // this.toastr.error("Failed", "Something went wrong");
      }
    })
  }

}

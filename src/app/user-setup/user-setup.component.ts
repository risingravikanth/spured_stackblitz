import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { CustomValidator } from "../shared/others/custom.validator";
import { SeoService, MobileDetectionService } from '../shared/services';
import { UserSetUpService } from "./user-setup.service";
import { CurrentUserService } from '../shared/services/currentUser.service';
@Component({
  selector: 'user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.scss'],
  providers: [CustomValidator, UserSetUpService, MessageService, SeoService, CurrentUserService],
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

  constructor(private messageService: MessageService,
    private router: Router,
    private formbuilder: FormBuilder,
    private userSetUpService: UserSetUpService,
    private route: ActivatedRoute,
    private seo: SeoService,
    private mobile:MobileDetectionService,
    private userService:CurrentUserService
  ) { }

  ngOnInit() {
    this.isMobile = this.mobile.isMobile();
    this.userSetUpForm();
    this.seo.generateTags({
      title: 'SignUp',
      description: 'signup through this awesome site',
      slug: 'signup-page'
    })
    this.userService.setTitle("Noticer | Signup");
  }


  userSetUpForm() {
    this.UserSetUpForm = this.formbuilder.group({
      userName: ["", { validators: [Validators.required] }],
      password: ["", { validators: [Validators.required] }],
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
    this.msgs = [];
    if (this.UserSetUpForm.invalid) {
      // alert("Please fill all the fields")
      this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Please fill all the fields!' });
    }
    // else if (this.UserSetUpForm.get('password').value != this.UserSetUpForm.get('matchingPassword').value) {
    //   alert("password not matched")
    // }
    //  
    else {
      this.btnText = "Creating new user.."
      this.userSetUpService.saveUser(this.UserSetUpForm.value).subscribe(
        resData => {
          this.responseData = resData;
          if (this.responseData.info || this.responseData.statusCode == "ERROR") {
            this.messageService.add({ severity: 'error', summary: 'Failed', detail: this.responseData.info });
          } else if (this.responseData.email) {
            this.messageService.add({ severity: 'success', summary: 'Signup Success', detail: 'Soon you will get confirmation mail!' });
            this.userSetUpForm();
            this.btnText = "Submit";
          } else {
            console.log(this.responseData);
          }
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Failed', detail: "Something went wrong!" });
        }
      );
    }
  }

  redirectLogin() {
    this.router.navigate(['/login']);
  }

}

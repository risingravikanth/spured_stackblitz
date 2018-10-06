import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidatorFn, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { CustomValidator } from "../shared/others/custom.validator";
import { UserSetUpService } from "./user-setup.service";
import { ParamMap } from "./user-setup.module";
import { PasswordValidation } from '../shared/others/password.validator';
import { AuthService } from "../shared/services/auth.service";
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
@Component({
  selector: 'user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.css'],
  providers: [CustomValidator, UserSetUpService, MessageService]
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
  msgs: Message[] = [];
  public showSpinner = false;
  public color = "primary";
  public mode = "indeterminate";
  user: any = {};
  placeholderString = 'Select timezone';
  mapJsonString: string;
  imageShow: boolean;
  public responseData: any = { successResponse: "", failedResponse: "", cancel: "" }
  showPasswordError: boolean = false;
  public image: File;
  loggedUser: any;

  constructor(private messageService: MessageService,
    private httpClient: HttpClient,
    private router: Router,
    private formbuilder: FormBuilder,
    private cus_validator: CustomValidator,
    private userSetUpService: UserSetUpService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.userSetUpForm();
  }


  userSetUpForm() {
    this.UserSetUpForm = this.formbuilder.group({
      userName: ["", { validators: [Validators.required] }],
      password: ['', { validators: [Validators.required] }],
      matchingPassword: ['', { validators: [Validators.required] }],
      phoneNum: ["", { validators: [Validators.required] }],
      email: ["", { validators: [Validators.required] }],
      gender: ["", { validators: [Validators.required] }]
    }
    );
  }

  saveUserSetUp() {
    if (this.UserSetUpForm.invalid) {
      alert("Please fill all the fields")
    } else if (this.UserSetUpForm.get('password').value != this.UserSetUpForm.get('matchingPassword').value) {
      alert("password not matched")
    } else {
      this.showSpinner = true;
      this.userSetUpService.saveUser(this.UserSetUpForm.value).subscribe(
        resData => {
          this.responseData = resData;
          this.showSpinner = false;
        }
      );
    }
  }

}

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
import { PermissionService } from '../shared/services/permission.service';
// import { NgxPermissionsService } from 'ngx-permissions';

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
  public responseData:any = { successResponse: "", failedResponse: "", cancel: "" }
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
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    // private per_service: NgxPermissionsService
  ) { }

  ngOnInit() {
    this.userSetUpForm();
    this.userDetailsForm();
    this.organizationDetailsForm();
    this.configurationDetailsForm();
    this.user.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.ConfigurationDetailsForm.value.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (this.user.timezone = "Asia/Calcutta") {
      this.user.timezone = "Asia/Kolkata";
      this.ConfigurationDetailsForm.value.timeZone = "Asia/Kolkata";
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/fms/dashboard';
    this.authForm = this.formbuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  changeTimezone(timezone) {
    this.user.timezone = timezone;
    this.UserSetUpForm.value.timeZone = timezone;
  }

  handleInputChange(event) {
    this.image = event.target.files[0];
    console.log(this.image);
  }

  userSetUpForm() {
    this.UserSetUpForm = this.formbuilder.group({
      // this.
      firstName: ["", { validators: [Validators.required] }],
      lastName: ["", { validators: [Validators.required] }],
      password: ['', { updateOn: 'blur', validators: [Validators.required] }],
      matchingPassword: ['', { validators: [Validators.required] }],
      phone: ["", { validators: [Validators.required] }],
      userName: ["", { validators: [Validators.required] }],
      adharNumber: ["", { validators: [Validators.required] }],
      jobTitle: ["", { validators: [Validators.required] }],
      timeZone: [""],
      zoneID: [""],
      role: [1],
      dateFormatId: ["MM/dd/yyyy", { validators: [Validators.required] }],
      currencyId: ["USD", { validators: [Validators.required] }],
      timeFormat: [""],
      organizationVO: this.formbuilder.group({
        organizationName: ["", { validators: [Validators.required] }],
        fleetSize: ["", { validators: [Validators.required] }],
        params: [""]
      })
    }
      , {
        validator: PasswordValidation.MatchPassword
      }
    );

  }

  markFormGroupTouched(formGroup: FormGroup) {
    this.showPasswordError = true;
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  userDetailsForm() {
    this.UserDetailsForm = this.formbuilder.group({
      firstName: ["", { validators: [Validators.required] }],
      lastName: ["", { validators: [Validators.required] }],
      password: ['', { updateOn: 'blur', validators: [Validators.required] }],
      matchingPassword: ['', { validators: [Validators.required] }],
      phone: ["", { validators: [Validators.required] }],
      userName: ["", [Validators.required, Validators.email]],
      adharNumber: ["", { validators: [Validators.required] }],
    }
      , {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  organizationDetailsForm() {
    this.OrganizationDetailsForm = this.formbuilder.group({
      organizationVO: this.formbuilder.group({
        organizationName: ["", { validators: [Validators.required] }],
        fleetSize: ["", { validators: [Validators.required] }],
        params: [""]
      }),
      jobTitle: ["", { validators: [Validators.required] }],
    });
  }

  configurationDetailsForm() {
    this.ConfigurationDetailsForm = this.formbuilder.group({
      timeZone: [""],
      zoneID: [""],
      dateFormatId: ["MM/dd/yyyy", { validators: [Validators.required] }],
      currencyId: ["USD", { validators: [Validators.required] }],
      timeFormat: ["12 Hours"],
    });
  }


  saveUserSetUp() {
    this.showSpinner = true;
    let selected: ParamMap = {
      dateformat: this.ConfigurationDetailsForm.value.dateFormatId,
      timezone: this.user.timezone,
      currencyformat: this.ConfigurationDetailsForm.value.currencyId,
      timeformat: this.ConfigurationDetailsForm.value.timeFormat
    }
    let formData: FormData = new FormData();
    if (this.image != undefined) {
      formData.append('file', this.image, this.image.name);
    }
    this.UserSetUpForm.patchValue(this.UserDetailsForm.value);
    this.UserSetUpForm.patchValue(this.OrganizationDetailsForm.value);
    this.UserSetUpForm.patchValue(this.ConfigurationDetailsForm.value);
    this.UserSetUpForm.controls['organizationVO'].patchValue({ params: selected });
    this.UserSetUpForm.controls['timeZone'].patchValue(this.user.timezone);
    this.UserSetUpForm.controls['zoneID'].patchValue(selected.timezone);
    // console.log("setup form" , this.UserSetUpForm.value);
    this.userSetUpService.saveUserSetUp(this.UserSetUpForm.value).subscribe(
      resData => {
        this.organizationVO = resData;
        if (this.image != undefined) {
          this.userSetUpService.saveUserSetUpWithImage(formData, this.organizationVO.id).subscribe(
            resData => {
              this.responseData = resData;
              this.showSpinner = false;
              this.imageShow = true;
              // this.imageBase64 = 'data:image/png;base64,' + this.responseData;
              if (this.responseData.successResponse) {
                this.msgs.push({ severity: 'success', summary: 'Success:', detail: "Signup success" });
                this.authForm.controls['username'].patchValue(this.UserDetailsForm.value.userName);
                this.authForm.controls['password'].patchValue(this.UserDetailsForm.value.password);
                this.login();
              }
            }
          );
        } else if (this.organizationVO && this.organizationVO.organizationName && this.organizationVO.organizationName != null) {
          this.showSpinner = false;
          this.msgs.push({ severity: 'success', summary: 'Success:', detail: "Signup success" });
          this.authForm.controls['username'].patchValue(this.UserDetailsForm.value.userName);
          this.authForm.controls['password'].patchValue(this.UserDetailsForm.value.password);
          this.login();
        }
      }, (err: HttpErrorResponse) => {
        this.showSpinner = false;
        alert(err.error.message);
      }
    );
  }


  private login() {
    this.authService.attemptAuth(this.authForm.value, this.returnUrl).subscribe(data => {
      // this.loggedUser = JSON.parse(data.body);
      // this.loggedUser.token = data.headers.get('Authorization');
      this.authService.setAuth(this.loggedUser);
      this.permissionService.getPermissions().subscribe(data => {
        let roleData: any = data;
        let authority: string[] = [];
        roleData.forEach(element => {
          authority.push(element.authority);
        });
        // this.per_service.loadPermissions(authority);
        this.router.navigate([this.returnUrl]);
      }, (err: HttpErrorResponse) => {
        console.log("permisssion error", err);
      })
    }, (err: HttpErrorResponse) => {
    });
  }
}

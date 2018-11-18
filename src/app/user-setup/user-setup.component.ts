import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { CustomValidator } from "../shared/others/custom.validator";
import { SeoService } from '../shared/services';
import { UserSetUpService } from "./user-setup.service";
@Component({
  selector: 'user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.scss'],
  providers: [CustomValidator, UserSetUpService, MessageService, SeoService],
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
    private userSetUpService: UserSetUpService,
    private route: ActivatedRoute,
    private seo: SeoService
  ) { }

  ngOnInit() {
    this.userSetUpForm();
    this.seo.generateTags({
      title: 'SignUp',
      description: 'signup through this awesome site',
      slug: 'signup-page'
    })
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
    if (this.UserSetUpForm.invalid) {
      // alert("Please fill all the fields")
      this.messageService.add({severity:'error', summary:'Failed', detail:'Please fill all the fields!'});
    }
    // else if (this.UserSetUpForm.get('password').value != this.UserSetUpForm.get('matchingPassword').value) {
    //   alert("password not matched")
    // }
    //  
    else {
      this.showSpinner = true;
      this.userSetUpService.saveUser(this.UserSetUpForm.value).subscribe(
        resData => {
          this.responseData = resData;
          if (this.responseData.info || this.responseData.statusCode == "ERROR") {
            this.messageService.add({severity:'error', summary:'Failed', detail:this.responseData.info});
          } else if (this.responseData.email) {
            this.messageService.add({severity:'success', summary:'Signup Success', detail:'Soon you will get confirmation mail!'});
            this.userSetUpForm();
          } else {
            console.log(this.responseData);
          }
          this.showSpinner = false;
        }
      );
    }
  }

  redirectLogin() {
    this.router.navigate(['/login']);
  }

}

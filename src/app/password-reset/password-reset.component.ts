import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from "primeng/components/common/messageservice";
import { CustomValidator } from '../shared/others/custom.validator';
import { UserProfileService } from './password-reset.service';

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
  providers: [UserProfileService, CustomValidator, MessageService],
  // animations: [routerTransition()]
})
export class PasswordResetComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder, private service: UserProfileService, private customValidator: CustomValidator) { }

  PasswordResetForm: FormGroup;

  ngOnInit() {
    this.formInit();
  }


  formInit() {
    this.PasswordResetForm = this.formbuilder.group({
      password: ['', { validators: [Validators.required] }],
      confirmPassword: ['', { validators: [Validators.required] }]
    }
    );
  }

  savePassword(){
    this.formInit();
  }

  cancel(){
    this.router.navigate(['/login']);
  }

}

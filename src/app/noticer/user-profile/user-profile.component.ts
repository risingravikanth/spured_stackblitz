import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePickerFormat } from "../../shared/others/datepickerFormat";
import { TimePickerFormat } from "../../shared/others/timepickerFormat";
import { MessageService } from "primeng/components/common/messageservice";
import { CustomValidator } from "../../shared/others/custom.validator";
import { routerTransition } from "../../router.animations";
import { Message } from 'primeng/components/common/api';
import { ElementRef } from '@angular/core';
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
  providers: [UserProfileService, CustomValidator, MessageService],
  animations: [routerTransition()]
})
export class UserProfileComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder, private service: UserProfileService, private customValidator: CustomValidator) { }

  ngOnInit(){
    
  }


}

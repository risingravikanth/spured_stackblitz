import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, Form } from '@angular/forms';
import { DatePickerFormat } from "../../shared/others/datepickerFormat";
import { TimePickerFormat } from "../../shared/others/timepickerFormat";
import { routerTransition } from "../../router.animations";
import { SettingsService } from './settings.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [SettingsService],
  animations: [routerTransition()]
})
export class SettingsComponent implements OnInit {

  changePassword: FormGroup;

  constructor(private router: Router, private formbuilder: FormBuilder, private service: SettingsService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.changePassword = this.formbuilder.group({
      existingPassword: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  savePassword() {
    console.log("save password");
    if (this.changePassword.valid) {
      this.service.updatePassword(this.changePassword.value).subscribe(
        (resData: any) => {
          console.log(resData);
          alert(resData.info);
          this.initForm();
        }
      )
    }
  }
}

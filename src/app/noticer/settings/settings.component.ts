import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePickerFormat } from "../../shared/others/datepickerFormat";
import { TimePickerFormat } from "../../shared/others/timepickerFormat";
import { routerTransition } from "../../router.animations";

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [],
  animations: [routerTransition()]
})
export class SettingsComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder) { }

  ngOnInit() {
  }
}

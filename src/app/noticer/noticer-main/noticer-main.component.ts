import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePickerFormat } from "../../shared/others/datepickerFormat";
import { TimePickerFormat } from "../../shared/others/timepickerFormat";
import { MessageService } from "primeng/components/common/messageservice";
import { CustomValidator } from "../../shared/others/custom.validator";
import { routerTransition } from "../../router.animations";
import {Message} from 'primeng/components/common/api';
import { NoticerMainService } from './noticer-main.service';

@Component({
  selector: 'noticer-main',
  templateUrl: './noticer-main.component.html',
  styleUrls: ['./noticer-main.component.css'],
  providers: [NoticerMainService, CustomValidator, MessageService],
  animations: [routerTransition()]
})
export class NoticerMainComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder, private service: NoticerMainService, private customValidator: CustomValidator) { }

 

  public parent:any = [];
  ngOnInit() {
  this.parent= [
        {
            name: "Item1",
            subItems: [
                {name: "SubItem1"},
                {name: "SubItem2"}
            ]
        },
        {
            name: "Item2",
            subItems: [
                {name: "SubItem3"},
                {name: "SubItem4"},
                {name: "SubItem5"}
            ]
        },
        {
            name: "Item3",
            subItems: [
                {name: "SubItem6"}
            ]
        }
    ];
  }


}

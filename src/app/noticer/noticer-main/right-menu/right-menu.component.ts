import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Message } from 'primeng/components/common/api';
import { ElementRef } from '@angular/core';
import { CustomValidator } from '../../../shared/others/custom.validator';
import { MessageService } from 'primeng/components/common/messageservice';
import { routerTransition } from '../../../router.animations';
import { CommonService } from '../../../shared/services/common.service';
import { Section } from '../../../shared/models/section.model';

@Component({
  selector: 'right-menu',
  templateUrl: './right-menu.component.html',
  styleUrls: ['./right-menu.component.css'],
  providers: [CustomValidator, MessageService],
  animations: [routerTransition()]
})
export class RightMenuComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder, private commonService: CommonService, private customValidator: CustomValidator) { }

  ngOnInit(){
  }


}

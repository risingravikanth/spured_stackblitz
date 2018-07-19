import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePickerFormat } from "../../shared/others/datepickerFormat";
import { TimePickerFormat } from "../../shared/others/timepickerFormat";
import { MessageService } from "primeng/components/common/messageservice";
import { CustomValidator } from "../../shared/others/custom.validator";
import { routerTransition } from "../../router.animations";
import { Message } from 'primeng/components/common/api';
import { NoticerMainService } from './noticer-main.service';
import { ElementRef } from '@angular/core';

import { CommonService } from "../../shared/services/common.service";
import { Section } from '../../shared/models/section.model';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';

@Component({
  selector: 'noticer-main',
  templateUrl: './noticer-main.component.html',
  styleUrls: ['./noticer-main.component.css'],
  providers: [NoticerMainService, CustomValidator, MessageService],
  animations: [routerTransition()]
})
export class NoticerMainComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder,
    private service: NoticerMainService,
    private customValidator: CustomValidator,
    private commonService: CommonService,
    public mobileService: MobileDetectionService) { }

  public questionName: any = '';
  public longStr;
  public maxLength;

  public isMobile: boolean;

  ngOnInit() {
    this.isMobile = this.mobileService.isMobile();
    this.getFavBoards();
    this.createVerbalPost();
    this.longStr = 'RAILWAY RECRUITMENT GROUP D NOTIFICATION 2018 - 62,907 VACANCIES Latest Railway Job Notifications Latest Railway Job Notifications Latest Railway Job Notifications Latest Railway Job Notifications';
    this.maxLength = 100;
    this.commonService.sectionChanges.subscribe(
      resData => {
        this.selectedCategory(resData);
      }
    )
  }

  showAll() {
    this.maxLength = this.longStr.length;
  }

  postQuestionDialog() {
    console.log("model opened");
  }

  getFavBoards() {;
    this.service.getFavoriteBoards().subscribe(resData => {
      console.log("All fav boards");
      console.log(resData);
    })
  }

  createVerbalPost() {
    let data = {
      "category": "cat",
      "model": "Aptitude",
      "postText": "test post from angular webapp",
      "imageUrl": ""
    }
    this.service.createVerbalPost(data).subscribe(
      resData => {
        console.log(resData);
      }
    )
  }


  selectedCategory(data: Section) {
    if (data) {
      this.questionName = '';
      if (data.section) {
        this.questionName = data.section;
      }
      if (data.category != 'HOME') {
        this.questionName = this.questionName + " (" + data.category + ")";
      }
      console.log(this.questionName);
    }
  }
}

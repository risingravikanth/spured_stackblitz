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
import { timeAgo } from '../../shared/others/time-age';

@Component({
  selector: 'noticer-main',
  templateUrl: './noticer-main.component.html',
  styleUrls: ['./noticer-main.component.css'],
  providers: [NoticerMainService, CustomValidator, MessageService],
  animations: [routerTransition()]
})
export class NoticerMainComponent implements OnInit {

  public isMobile: boolean;

  constructor(private router: Router, private formbuilder: FormBuilder,
    private service: NoticerMainService,
    private customValidator: CustomValidator,
    private commonService: CommonService,
    public mobileService: MobileDetectionService) { }

  public questionName: any = '';
  public postsList: any = [];
  public limit = 5;
  public offset = 0;
  public showPostSpinner = false;

  ngOnInit() {
    this.isMobile = this.mobileService.isMobile();
    // this.getFavBoards();
    // this.createVerbalPost();
    this.getPosts();
    this.commonService.sectionChanges.subscribe(
      resData => {
        this.selectedCategory(resData);
      }
    )
  }

  postQuestionDialog() {
    console.log("model opened");
  }

  getFavBoards() {
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


  getPosts() {
    let data = { "category": "cat", "offset": 0, "limit": this.limit }
    this.showPostSpinner = true;
    this.service.getPostsList(data).subscribe(
      resData => {
        this.showPostSpinner = false;
        this.postsList = resData;
        this.preparePostsList();
      })
    }
    
    loadMorePosts() {
      this.offset = this.offset + 5;
      this.showPostSpinner = true;
      let data = { "category": "cat", "offset": this.offset, "limit": this.limit }
      this.service.getPostsList(data).subscribe(
        (resData:any) => {
          this.showPostSpinner = false;
        resData.forEach(element => {
          this.postsList.push(element);
        });
        this.preparePostsList();
      })
  }

  preparePostsList(){
    this.postsList.forEach(element => {
      element.maxLength = 25;
      element.selectComments = false;
    });
  }
}

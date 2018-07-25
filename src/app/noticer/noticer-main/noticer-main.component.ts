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
import { PostRequest, Pagination, Context, Data } from '../../shared/models/request';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

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
    public mobileService: MobileDetectionService,
    private modalService:NgbModal) { }

  public questionName: any = '';
  public postsList: any = [];
  public showPostSpinner = false;

  public urls = new Array<string>();
  public reqBody = new PostRequest();

  public categoryModalReference:NgbModalRef;
  closeResult: string;

  fromdate:Date;
  todate:Date;
  public audienceList: any[];
  ngOnInit() {
    this.audienceList = [
      {label: 'Computers', value: 'CSE'},
      {label: 'Eletronics', value: 'ECE'},
      {label: 'IT', value: 'IT'},
      {label: 'MECH', value: 'MECH'},
      {label: 'Chemical', value: 'CHEM'}
  ];
    this.isMobile = this.mobileService.isMobile();
    // this.getFavBoards();
    // this.createVerbalPost();
    this.initRequest();
    this.getPosts();
    this.commonService.sectionChanges.subscribe(
      resData => {
        this.selectedCategory(resData);
      }
    )
  }


  initRequest(){
    
    this.reqBody.pagination = new Pagination();;
    this.reqBody.pagination.offset = 0

    this.reqBody.context = new Context();
    this.reqBody.context.type = "VERBAL";

    this.reqBody.data = new Data();
    this.reqBody.data.category = null;
    this.reqBody.data.model = null
  }


  postQuestionDialog(content:any) {
    console.log("model opened");

    this.categoryModalReference = this.modalService.open(content, { size: 'lg' });
    this.categoryModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    console.log(reason);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
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
        this.questionName = data.section.toUpperCase();
      }
      if (data.category != 'HOME') {
        this.reqBody.data.category = data.category.toUpperCase();
        this.questionName = this.questionName.toUpperCase() + " (" + data.category + ")";
      } else{
        this.reqBody.data.category = null;
      }
      console.log(this.questionName);
      if(data.section){
        this.reqBody.context.type = data.section.toUpperCase();
      }
      // this.reqBody.data.model = data.model
      this.getPosts();
    }
  }


  getPosts() {
    this.showPostSpinner = true;
    this.postsList = [];

    this.service.getPostsList(this.reqBody).subscribe(
      resData => {
        this.showPostSpinner = false;
        let obj:any = resData;
        this.postsList = obj.posts;
        this.preparePostsList();
      })

  }

  loadMorePosts() {
    this.reqBody.pagination.offset = this.reqBody.pagination.offset + 10;
    this.showPostSpinner = true;
    this.service.getPostsList(this.reqBody).subscribe(
      (resData: any) => {
        this.showPostSpinner = false;
        let obj:any = resData;
        obj.posts.forEach(element => {
          this.postsList.push(element);
        });
        this.preparePostsList();
      })
  }

  preparePostsList() {
    this.postsList.forEach(element => {
      element.maxLength = 25;
      element.selectComments = false;
    });
  }

  detectFiles(event) {
    this.urls = [];
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }
  }

  private posts(){
    let posts = {
         "posts": [
             {
                 "_type": "VerbalPost",
                 "category": "cat",
                 "model": "Aptitude",
                 "postId": 124,
                 "userId": 1,
                 "userProfile": {
                     "userId": 1,
                     "userName": "Durgarao Asapu",
                     "email": "1@1.com",
                     "profileImageUrl": "https://s3.ap-south-1.amazonaws.com/noticerprofilepics/noticeboard-dp.jpeg"
                 },
                 "postText": "test post from angular webapp",
                 "imageUrl": "",
                 "commentsCount": 0,
                 "createTime": 1532025092000,
                 "updateTime": 18000000
             },
             {
                 "_type": "VerbalPost",
                 "category": "cat",
                 "model": "Aptitude",
                 "postId": 123,
                 "userId": 1,
                 "userProfile": {
                     "userId": 1,
                     "userName": "Durgarao Asapu",
                     "email": "1@1.com",
                     "profileImageUrl": "https://s3.ap-south-1.amazonaws.com/noticerprofilepics/noticeboard-dp.jpeg"
                 },
                 "postText": "test post from angular webapp",
                 "imageUrl": "",
                 "commentsCount": 0,
                 "createTime": 1532025001000,
                 "updateTime": 18000000
             },
             {
                 "_type": "VerbalPost",
                 "category": "cat",
                 "model": "Aptitude",
                 "postId": 122,
                 "userId": 1,
                 "userProfile": {
                     "userId": 1,
                     "userName": "Durgarao Asapu",
                     "email": "1@1.com",
                     "profileImageUrl": "https://s3.ap-south-1.amazonaws.com/noticerprofilepics/noticeboard-dp.jpeg"
                 },
                 "postText": "test post from angular webapp",
                 "imageUrl": "",
                 "commentsCount": 0,
                 "createTime": 1532024678000,
                 "updateTime": 18000000
             },
             {
                 "_type": "QuantsPost",
                 "category": "cat",
                 "model": "aptitude",
                 "postId": 2,
                 "userId": 1,
                 "userProfile": {
                     "userId": 1,
                     "userName": "Durgarao Asapu",
                     "email": "1@1.com",
                     "profileImageUrl": "https://s3.ap-south-1.amazonaws.com/noticerprofilepics/noticeboard-dp.jpeg"
                 },
                 "postText": "qants cat durgi",
                 "imageUrl": "quants cat image url",
                 "commentsCount": 1,
                 "createTime": 1468763306000,
                 "updateTime": 1466577739000
             },
             {
                 "_type": "QuantsPost",
                 "category": "cat",
                 "model": "Aptitude",
                 "postId": 4,
                 "userId": 1,
                 "userProfile": {
                     "userId": 1,
                     "userName": "Durgarao Asapu",
                     "email": "1@1.com",
                     "profileImageUrl": "https://s3.ap-south-1.amazonaws.com/noticerprofilepics/noticeboard-dp.jpeg"
                 },
                 "postText": "Hai durgi",
                 "imageUrl": "",
                 "commentsCount": 0,
                 "createTime": 1468388957000,
                 "updateTime": 18000000
             },
             {
                 "_type": "EventsPost",
                 "postId": 14,
                 "userId": 1,
                 "userProfile": {
                     "userId": 1,
                     "userName": "Durgarao Asapu",
                     "email": "1@1.com",
                     "profileImageUrl": "https://s3.ap-south-1.amazonaws.com/noticerprofilepics/noticeboard-dp.jpeg"
                 },
                 "postText": "New post",
                 "imageUrl": "",
                 "commentsCount": 0,
                 "createTime": 1483598064000,
                 "updateTime": 1484998077000,
                 "instId": 0,
                 "deptId": 0,
                 "eventCategory": "management",
                 "eventType": "AdZap",
                 "topic": "topic"
             },
             {
                 "_type": "EventsPost",
                 "postId": 13,
                 "userId": 1,
                 "userProfile": {
                     "userId": 1,
                     "userName": "Durgarao Asapu",
                     "email": "1@1.com",
                     "profileImageUrl": "https://s3.ap-south-1.amazonaws.com/noticerprofilepics/noticeboard-dp.jpeg"
                 },
                 "postText": "New post in management",
                 "imageUrl": "",
                 "commentsCount": 0,
                 "createTime": 1483597981000,
                 "updateTime": 18000000,
                 "instId": 0,
                 "deptId": 0,
                 "eventCategory": "management",
                 "eventType": "Finance",
                 "topic": "Management",
                 "fromdate": "2017-01-06",
                 "todate": "2017-01-10"
             },
             {
                 "_type": "EventsPost",
                 "postId": 12,
                 "userId": 1,
                 "userProfile": {
                     "userId": 1,
                     "userName": "Durgarao Asapu",
                     "email": "1@1.com",
                     "profileImageUrl": "https://s3.ap-south-1.amazonaws.com/noticerprofilepics/noticeboard-dp.jpeg"
                 },
                 "postText": "post",
                 "imageUrl": "url",
                 "commentsCount": 0,
                 "createTime": 1483597842000,
                 "updateTime": 18000000,
                 "instId": 1,
                 "deptId": 1,
                 "eventCategory": "TF",
                 "eventType": "s",
                 "topic": "ethicalhacking-3",
                 "fromdate": "2017-10-10",
                 "todate": "2017-11-11",
                 "website": "tz2k16.com",
                 "contacts": "8500506013"
             }
         ]
     }
     return posts;
 }
}

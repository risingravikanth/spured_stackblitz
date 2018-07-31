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
import { Pagination, Context, Data, GetRequest } from '../../shared/models/request';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
    private modalService: NgbModal) { }

  public questionName: any = '';
  public postsList: any = [];
  public showPostSpinner = false;

  public urls = new Array<string>();
  public getRequestBody = new GetRequest();

  public categoryModalReference: NgbModalRef;
  closeResult: string;

  fromdate: Date;
  todate: Date;
  public audienceList: any[];

  addPostForm: FormGroup;

  public showAddPost: any = {
    careers: false,
    events: false,
    gk: false,
    quants: false,
    verbal: false,
  }

  ngOnInit() {
    this.audienceList = [
      { name: 'Computers', value: 'CSE' },
      { label: 'Eletronics', value: 'ECE' },
      { label: 'IT', value: 'IT' },
      { label: 'MECH', value: 'MECH' },
      { label: 'Chemical', value: 'CHEM' }
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
    this.questionName = "";
    this.initAddPostForm();
    this.intitDummyData();
  }

  initAddPostForm() {
    this.addPostForm = this.formbuilder.group({
      context: this.formbuilder.group({
        type: [null, Validators.required]
      }),
      data: this.formbuilder.group({
        text: [null, Validators.required],
        images: [''],
        category: [''],
        model: [''],
        deadline: [''],
        qualifications: [''],
        state: [''],
        institute: [''],
        fromdate: [''],
        todate: ['']
      }),
    });
  }


  initRequest() {

    this.getRequestBody.pagination = new Pagination();;
    this.getRequestBody.pagination.offset = 0

    this.getRequestBody.context = new Context();
    this.getRequestBody.context.type = "VERBAL";

    this.getRequestBody.data = new Data();
    this.getRequestBody.data.category = null;
    this.getRequestBody.data.model = null
  }


  postQuestionDialog(content: any) {
    console.log("Modal for:" + this.getRequestBody.context.type)
    if (this.getRequestBody.context) {
      let obj = {}
      obj[this.getRequestBody.context.type.toLowerCase()] = true;
      this.makeAddPostsFalse(obj);
    }
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
      return `with: ${reason}`;
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
      this.initRequest();
      this.questionName = '';
      if (data.section) {
        this.questionName = data.section.toUpperCase();
      }
      if (data.category != 'HOME') {
        this.getRequestBody.data.category = data.category.toUpperCase();
        this.questionName = this.questionName.toUpperCase() + " (" + data.category + ")";
      } else {
        this.getRequestBody.data.category = null;
      }
      console.log(this.questionName);
      if (data.section) {
        this.getRequestBody.context.type = data.section.toUpperCase();
      }
      // this.getRequestBody.data.model = data.model
      this.getPosts();
    }
  }


  getPosts() {
    this.showPostSpinner = true;
    this.postsList = [];

    this.service.getPostsList(this.getRequestBody).subscribe(
      resData => {
        this.showPostSpinner = false;
        let obj: any = resData;
        this.postsList = obj.posts;
        this.preparePostsList();
      })

  }

  loadMorePosts() {
    this.getRequestBody.pagination.offset = this.getRequestBody.pagination.offset + 10;
    this.showPostSpinner = true;
    this.service.getPostsList(this.getRequestBody).subscribe(
      (resData: any) => {
        this.showPostSpinner = false;
        let obj: any = resData;
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


  makeAddPostsFalse(obj: Object) {
    this.urls = [];
    this.showAddPost.verbal = this.showAddPost.quants = this.showAddPost.gk = this.showAddPost.events = this.showAddPost.careers = false;
    Object.keys(obj).forEach((key) => this.showAddPost[key] = obj[key]);
  }


  public categories: any = [];
  public models: any = [];
  intitDummyData() {
    this.categories = [
      { label: 'CAT', value: 'cat' },
      { label: 'MAT', value: 'mat' }
    ];
    this.models = [
      { label: 'Aptitude', value: 'aptitude' },
      { label: 'Reasoning', value: 'reasoning' }
    ];
  }
}
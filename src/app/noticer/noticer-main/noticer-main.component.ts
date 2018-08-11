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
import { Pagination, Context, Data, GetPostsRequest, GetCommentRequest, CommentContext, CreateCommentRequest, CreateCommentData } from '../../shared/models/request';
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
  public getPostsRequestBody = new GetPostsRequest();

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
    general: false
  }
  public sectionsTypesMappings: any = [];
  public disableCategory = false;
  ngOnInit() {
    this.audienceList = [
      { name: 'Computers', value: 'CSE' },
      { label: 'Eletronics', value: 'ECE' },
      { label: 'IT', value: 'IT' },
      { label: 'MECH', value: 'MECH' },
      { label: 'Chemical', value: 'CHEM' }
    ];

    this.sectionsTypesMappings = [
      { section: 'VERBAL', _type: 'VerbalPost' },
      { section: 'QUANTS', _type: 'QuantsPost' },
      { section: 'EVENTS', _type: 'EventPost' },
      { section: 'CAREERS', _type: 'CareerPost' },
    ];
    this.isMobile = this.mobileService.isMobile();
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
        _type: [null, Validators.required],
        category: [null, Validators.required],
        text: [null, Validators.required],
        // images: [null],
        model: [null, Validators.required],
        deadline: [null],
        qualifications: [null],
        state: [null],
        institute: [null],
        fromdate: [null],
        todate: [null],
        topic: [null]
      }),
    });
    this.disableCategory = false;
  }




  initRequest() {

    this.getPostsRequestBody.pagination = new Pagination();;
    this.getPostsRequestBody.pagination.offset = 0

    this.getPostsRequestBody.context = new Context();
    this.getPostsRequestBody.context.type = 'ALL';

    this.getPostsRequestBody.data = new Data();
    this.getPostsRequestBody.data.category = null;
    this.getPostsRequestBody.data.model = null
  }


  postQuestionDialog(content: any) {
    console.log("Modal for:" + this.getPostsRequestBody.context.type)
    if (this.getPostsRequestBody.context.type != 'ALL') {
      let obj = {}
      obj[this.getPostsRequestBody.context.type.toLowerCase()] = true;
      this.makeAddPostsFalse(obj);
    } else {
      let obj = {}
      obj['general'] = true;
      this.makeAddPostsFalse(obj);
    }
    if (this.getPostsRequestBody.data.category) {
      this.addPostForm.controls['data'].get('category').patchValue(this.getPostsRequestBody.data.category);
      this.disableCategory = true;
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
    this.initAddPostForm();
    this.addPostForm.enable();
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
        this.getPostsRequestBody.context.type = this.questionName;
      }
      if (data.category != 'HOME') {
        this.getPostsRequestBody.data.category = data.category.toUpperCase();
        this.questionName = this.questionName.toUpperCase() + " (" + data.category + ")";
      } else {
        this.getPostsRequestBody.data.category = null;
      }
      console.log(this.questionName);
      if (data.section) {
        this.getPostsRequestBody.context.type = data.section.toUpperCase();
      }
      // this.getRequestBody.data.model = data.model
      this.getPosts();
    }
  }


  getPosts() {
    this.showPostSpinner = true;
    this.postsList = [];

    this.service.getPostsList(this.getPostsRequestBody).subscribe(
      resData => {
        this.showPostSpinner = false;
        let obj: any = resData;
        if (obj.error && obj.error.code && obj.error.code.id) {
          alert(obj.error.code.message)
        } else {
          this.postsList = obj.posts;
          this.preparePostsList();
        }
      })
  }

  loadMorePosts() {
    this.getPostsRequestBody.pagination.offset = this.getPostsRequestBody.pagination.offset + 10;
    this.showPostSpinner = true;
    this.service.getPostsList(this.getPostsRequestBody).subscribe(
      resData => {
        this.showPostSpinner = false;
        let obj: any = resData;
        if (obj.error && obj.error.code && obj.error.code.id) {
          alert(obj.error.code.message);
        } else {
          obj.posts.forEach(element => {
            let existedArr = this.postsList.filter(item => item.postId == element.postId);
            if (existedArr.length == 0) {
              this.postsList.push(element);
            }
          });
          this.preparePostsList();
        }
      })
  }

  preparePostsList() {
    if (this.postsList.length > 0) {
      this.postsList.forEach(element => {
        element.maxLength = 25;
        element.selectComments = false;
        element.commentOffset = 0;
        element.comments = [];
        element.commentsSpinner = false;
        element.commentText = null;
      });
    }
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
    this.showAddPost.verbal = this.showAddPost.quants = this.showAddPost.gk = this.showAddPost.events = this.showAddPost.careers = this.showAddPost.general = false;
    Object.keys(obj).forEach((key) => this.showAddPost[key] = obj[key]);
  }


  createPost() {
    let reqType;
    if (this.getPostsRequestBody.context && !this.showAddPost.general) {
      reqType = this.getPostsRequestBody.context.type;
      let _typeArr = this.sectionsTypesMappings.filter(item => item.section == reqType);
      this.addPostForm.controls['data'].get('_type').patchValue(_typeArr[0]._type);
      this.addPostForm.controls['context'].get('type').patchValue(this.getPostsRequestBody.context.type);
    } else {
      let reqType = this.addPostForm.controls['data'].get('_type').value;
      let _typeArr = this.sectionsTypesMappings.filter(item => item.section == reqType);
      this.addPostForm.controls['data'].get('_type').patchValue(_typeArr[0]._type);
      this.addPostForm.controls['context'].get('type').patchValue(reqType);
    }

    console.log(this.addPostForm.value);
    if (this.addPostForm.valid) {
      this.service.createPost(this.addPostForm.value).subscribe((resData: any) => {
        if (resData && resData.code && resData.code.id) {
          alert(resData.code.longMessage);
        } else if (resData && resData.post) {
          let data = resData.post;
          data.maxLength = 25;
          data.selectComments = false;
          data.commentOffset = 0;
          data.comments = [];
          data.commentsSpinner = false;
          this.postsList.splice(0, 0, data);
          this.initAddPostForm();
          alert("Successfully added post");
          this.categoryModalReference.close();
        } else {
          alert("Something went wrong!");
        }

      })
    } else {
      alert("Plese fill all the details!");
    }

  }

  getCommentsForPost(postId, index) {
    let reqBody = this.prepareGetComentsRequestBody(postId, index);
    if (this.postsList[index].commentsCount > 0) {
      this.postsList[index].commentsSpinner = true;
      this.service.getCommentsByPostId(reqBody).subscribe(resData => {
        this.postsList[index].commentsSpinner = false;
        let comments: any = resData;
        if (comments && comments.code && comments.code.id) {
          alert(comments.code.longMessage);
        } else if (comments && comments.comments) {
          if (comments.comments.length > 0) {
            this.postsList[index].comments = comments.comments;
          }
        }
      })
    }
  }

  loadMoreComments(postId, index) {
    this.postsList[index].commentOffset = this.postsList[index].commentOffset + 3;
    this.postsList[index].commentsSpinner = true;
    let reqBody = this.prepareGetComentsRequestBody(postId, index);
    reqBody.pagination.offset = this.postsList[index].commentOffset;
    this.service.getCommentsByPostId(reqBody).subscribe(resData => {
      this.postsList[index].commentsSpinner = false;
      let comments: any = resData;
      if (comments && comments.code && comments.code.id) {
        alert(comments.code.longMessage);
      } else if (comments && comments.comments) {
        if (comments.comments.length > 0) {
          comments.comments.forEach(element => {
            let existedComments = this.postsList[index].comments.filter(item => item.commentId == element.commentId);
            if (existedComments.length == 0) {
              this.postsList[index].comments.push(element);
            }
          });
        }
      }
    })
  }


  showMoreCommentsChecker(comments, commentsCount) {
    if (comments.length < 3 || comments.length == commentsCount) {
      return false;
    }
    return true;
  }

  prepareGetComentsRequestBody(postId, index) {
    // let body = { id: postId, limit: 3, offset: 0 };
    let postObj = this.postsList[index];
    let getCommentsRequest = new GetCommentRequest();
    let arrTypes = this.sectionsTypesMappings.filter(item => item._type == postObj._type);
    getCommentsRequest.context = new CommentContext();
    getCommentsRequest.context.postId = postId;
    getCommentsRequest.context.type = arrTypes[0].section;
    getCommentsRequest.data = {};
    getCommentsRequest.pagination = new Pagination();
    getCommentsRequest.pagination.offset = 0;
    getCommentsRequest.pagination.limit = 3;
    return getCommentsRequest;
  }

  createComment(commentText, index) {
    let createCommentRequest = new CreateCommentRequest();
    let postObj = this.postsList[index];
    let arrTypes = this.sectionsTypesMappings.filter(item => item._type == postObj._type);
    createCommentRequest.context = new CommentContext();
    createCommentRequest.context.type = arrTypes[0].section;
    createCommentRequest.context.postId = postObj.postId;

    createCommentRequest.data = new CreateCommentData();
    createCommentRequest.data.text = commentText;
    createCommentRequest.data._type = "Comment";

    this.service.createComment(createCommentRequest).subscribe((resData: any) => {

      if (resData && resData.code && resData.code.id) {
        alert(resData.code.longMessage);
      } else {
        this.postsList[index].commentText = null;
        this.postsList[index].comments.push(resData.comment);
        this.postsList[index].commentsCount = this.postsList[index].commentsCount + 1;
      }
    })
  }


  public categories: any = [];
  public models: any = [];
  public types: any = [];
  public states: any = [];
  public institutes: any = [];
  intitDummyData() {
    this.categories = [
      { label: 'CAT', value: 'CAT' },
      { label: 'MAT', value: 'MAT' }
    ];
    this.models = [
      { label: 'Aptitude', value: 'aptitude' },
      { label: 'Reasoning', value: 'reasoning' }
    ];
    this.types = [
      { label: 'Verbal', value: 'VERBAL' },
      { label: 'Quants', value: 'QUANTS' },
      { label: 'Events', value: 'EVENTS' }
    ];
    this.states = [
      { label: 'AP', value: 'AP' },
      { label: 'TS', value: 'TS' }]
    this.institutes = [
      { label: 'IIIT', value: 'IIIT' },
      { label: 'RGUKT', value: 'RGUKT' }];
  }
}
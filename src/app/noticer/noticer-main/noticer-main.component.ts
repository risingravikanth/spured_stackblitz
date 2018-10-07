import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageService } from "primeng/components/common/messageservice";
import { CustomValidator } from "../../shared/others/custom.validator";
import { routerTransition } from "../../router.animations";
import { NoticerMainService } from './noticer-main.service';

import { CommonService } from "../../shared/services/common.service";
import { Section } from '../../shared/models/section.model';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';
import { timeAgo } from '../../shared/others/time-age';
import { Pagination, Context, Data, GetPostsRequest, GetCommentRequest, CommentContext, CreateCommentRequest, CreateCommentData } from '../../shared/models/request';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as constant from '../../shared/others/constants'
import * as categories_types_models from '../../shared/master-data/master-data'
// import { ConfirmationService } from 'primeng/primeng';

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
    private commonService: CommonService,
    public mobileService: MobileDetectionService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    // private confirmService: ConfirmationService
    ) { }

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
  editPostForm: FormGroup;

  public fileSelected: File;
  public chooseFile = false;
  public postImages = [];
  public isValidType = false;
  public isValidCategory = false;
  public sectionsTypesMappings: any = [];
  public showMoreLink = true;
  public serverUrl;
  public categories: any = [];
  public models: any = [];
  public types: any = [];
  public states: any = [];
  public institutes: any = [];

  ngOnInit() {
    this.serverUrl = constant.REST_API_URL;
    this.audienceList = categories_types_models.AUDIENCE;
    this.sectionsTypesMappings = categories_types_models.SECTION_MAPPINGS;

    this.isMobile = this.mobileService.isMobile();
    this.questionName = "";
    this.initAddPostForm();
    this.initEditForm();
    this.intitDummyData();
    this.route.queryParams.subscribe(this.handleParams.bind(this));
  }

  initAddPostForm() {
    this.addPostForm = this.formbuilder.group({
      context: this.formbuilder.group({
        type: [null, Validators.required]
      }),
      data: this.formbuilder.group({
        _type: [null, Validators.required],
        _type1: [null, Validators.required],
        postText: [null, Validators.required],
        text: [null],
        model: [null],
        category: [null],
        images: [""],
        topic: [null],
        contacts: [null],
        website: [null],
        fromdate: [null],
        todate: [null],
        deadline: [null],
        qualifications: [null],
      }),
    });
  }
  initEditForm() {
    this.editPostForm = this.formbuilder.group({
      postId: [null, Validators.required],
      postText: [null, Validators.required],
      _type: [null, Validators.required]
    });
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


  handleParams(params: any[]) {
    let type = params['type'];
    let category = params['category'];

    let sec = new Section();
    sec.section = type;
    sec.category = category
    if (type == undefined && category == undefined) {
      this.initRequest()
      this.getPosts();
      this.questionName = "";
    } else {
      this.selectedCategory(sec);
    }
    if (this.isMobile) {
      this.commonService.updateHeaderMenu("noticer");
    }
  }


  postQuestionDialog(content: any) {
    console.log("Modal for:" + this.getPostsRequestBody.context.type)
    this.resetDropdowns();
    if (this.getPostsRequestBody.context.type && this.getPostsRequestBody.context.type != 'ALL') {
      let reqType = this.getPostsRequestBody.context.type;
      this.getCategoriesByType(reqType);
      let _typeArr = this.sectionsTypesMappings.filter(item => item.section == reqType);
      this.addPostForm.controls['data'].get('_type1').patchValue(reqType);
      this.addPostForm.controls['data'].get('_type').patchValue(_typeArr[0]._type);
      this.addPostForm.controls['context'].get('type').patchValue(reqType);
      this.isValidType = true;
    }
    if (this.getPostsRequestBody.data.category) {
      this.addPostForm.controls['data'].get('category').patchValue(this.getPostsRequestBody.data.category.toLocaleLowerCase());
      this.isValidCategory = true;
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
          if (obj.posts.length < 10) {
            this.showMoreLink = false;
          }
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
        element.maxLength = 300;
        element.selectComments = false;
        element.commentOffset = 0;
        element.comments = [];
        element.commentsSpinner = false;
        element.commentText = null;
      });
    }
  }

  detectFiles(event) {
    this.postImages = []
    this.urls = [];
    let files = event.target.files;
    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
        this.postImages.push(file);
      }
    }
  }

  createPost() {
    if (this.getPostsRequestBody.context.type && this.getPostsRequestBody.context.type == 'ALL') {
      let reqType = this.addPostForm.controls['data'].get('_type1').value;
      let _typeArr = this.sectionsTypesMappings.filter(item => item.section == reqType);
      this.addPostForm.controls['data'].get('_type').patchValue(_typeArr[0]._type);
      this.addPostForm.controls['context'].get('type').patchValue(reqType);
    }

    console.log(this.addPostForm.value);
    let postText = this.addPostForm.controls['data'].get('postText').value
    let txt = postText.replace(/\n/g, '<br>');
    this.addPostForm.controls['data'].get('text').patchValue(txt);

    let imageUrls = [];
    if (this.postImages.length > 0) {
      this.postImages.forEach(element => {
        let formData: FormData = new FormData();
        formData.append('file', element);
        this.service.uploadImage(formData).subscribe((resData: any) => {
          imageUrls.push(resData.url);
          if (this.postImages.length == imageUrls.length) {
            this.addPostForm.controls["data"].get("images").patchValue(imageUrls);
            this.savePost();
          }
        })
      })
    } else {
      this.addPostForm.controls["data"].get("images").patchValue([]);
      this.savePost()
    }
  }

  savePost() {
    if (this.addPostForm.valid) {
      this.service.createPost(this.addPostForm.value).subscribe((resData: any) => {
        if (resData && resData.code && resData.code.id) {
          alert(resData.code.longMessage);
        } else if (resData && resData.post) {
          let data = resData.post;
          data.maxLength = 300;
          data.selectComments = false;
          data.commentOffset = 0;
          data.comments = [];
          data.commentsSpinner = false;
          this.postsList.splice(0, 0, data);
          this.initAddPostForm();
          alert("Successfully added post");
          this.categoryModalReference.close();
          this.postImages = [];
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
    this.postsList[index].commentOffset = 0;;
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
            this.postsList[index].comments.forEach(element => {
              element.maxLength = 300;
            });
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
        resData.comment.maxLength = 100;
        this.postsList[index].comments.splice(0, 0, resData.comment);
        this.postsList[index].commentsCount = this.postsList[index].commentsCount + 1;
      }
    })
  }

  intitDummyData() {
    this.models = categories_types_models.MODELS;
    this.types = categories_types_models.TYPES;
    this.states = [
      { label: 'AP', value: 'AP' },
      { label: 'TS', value: 'TS' }]
    this.institutes = [
      { label: 'IIIT', value: 'IIIT' },
      { label: 'RGUKT', value: 'RGUKT' }];
  }

  getCategoriesByType(type) {
    this.categories = [];
    categories_types_models.SECTIONS.forEach(sec => {
      if (sec.title == "Topics") {
        sec.sections.forEach(ty => {
          if (ty.code == type) {
            ty.categories.forEach(ca => {
              if (ca.name != "HOME") {
                let vo = { label: ca.name, value: ca.code };
                this.categories.push(vo);
              }
            })
          }
        })
      }
    });
  }

  resetDropdowns() {
    //resetting values after type chage
    this.addPostForm.controls['data'].get('website').patchValue(null);
    this.addPostForm.controls['data'].get('model').patchValue(null);
    this.addPostForm.controls['data'].get('category').patchValue(null);
    this.addPostForm.controls['data'].get('topic').patchValue(null);
    this.addPostForm.controls['data'].get('contacts').patchValue(null);
    this.addPostForm.controls['data'].get('fromdate').patchValue(null);
    this.addPostForm.controls['data'].get('todate').patchValue(null);
    this.addPostForm.controls['data'].get('qualifications').patchValue(null);
  }

  deletePost(postId: any) {
    let index = this.postsList.findIndex(item => item.postId == postId);
    // this.confirmService.confirm({
    //   message: 'Are you sure that you want to delete?',
    //   accept: () => {
        //Actual logic to perform a confirmation
        // this.service.deletePost(postId).subscribe(resData =>{
        this.postsList.splice(index, 1);
        // })
    //   }
    // });
  }

  editPost(postId: any, content: any) {
    this.postsList.forEach(element => {
      if (element.postId == postId) {
        this.editPostForm.controls['postText'].patchValue(element.postText);
        this.editPostForm.controls['postId'].patchValue(element.postId);
        this.editPostForm.controls['_type'].patchValue(element._type);
      }
    });

    this.categoryModalReference = this.modalService.open(content, { size: 'lg' });
    this.categoryModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  saveEditPost() {
    console.log(this.editPostForm.value);
    this.categoryModalReference.close();
  }
}
import { animate, state, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser, isPlatformServer, Location } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from 'primeng/components/common/api';
import * as categories_types_models from '../../shared/master-data/master-data';
import { CommentContext, Context, CreateCommentData, CreateCommentRequest, Data, GetCommentRequest, GetPostsRequest, Pagination } from '../../shared/models/request';
import { Section } from '../../shared/models/section.model';
import { User } from '../../shared/models/user.model';
import * as constant from '../../shared/others/constants';
import { CustomValidator } from "../../shared/others/custom.validator";
import { CommonService, SeoService } from '../../shared/services';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';
import { ToastrService } from '../../shared/services/Toastr.service';
import { CoreMainService } from './core-main.service';



const RESULT_KEY = makeStateKey<string>('result');
const RESULTBYID_KEY = makeStateKey<string>('resultbyid');

@Component({
  selector: 'core-main',
  templateUrl: './core-main.component.html',
  styleUrls: ['./core-main.component.css'],
  animations: [
    // animation triggers go here
    trigger('openClose', [
      // ...
      state('open', style({

      })),
      state('closed', style({

      })),
      transition('open => closed', [
        animate('3000ms')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ]),
    ]),
  ],
  providers: [CoreMainService, CustomValidator, ConfirmationService, SeoService, ToastrService]
})
export class CoreMainComponent implements OnInit {

  @ViewChild('sideMenuDialogDialog') sideMenuModalCotent: any;
  @ViewChild('postDialog') postDialog: ElementRef;
  @Input("from") from: any;
  @Input("activeTab") activeTab: any;

  public isMobile: boolean;
  private isServer: boolean;
  public profileImage: any;
  public currentUser: User;
  public validUser: boolean = false;
  public noData: boolean = false;
  public boardId: any;
  public groupId: any;
  public reqestType: string;
  public windowStyle: any;
  public underMaintenace: boolean = true;
  public showMoreActivity: boolean = true;
  profileParamId: any;
  public errorTextMessage: any = "";

  constructor(private router: Router, private formbuilder: FormBuilder,
    private service: CoreMainService,
    private userService: CurrentUserService,
    public mobileService: MobileDetectionService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private confirmService: ConfirmationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService, private location: Location,
    private commonService: CommonService,
    private toastr: ToastrService,
    private tstate: TransferState

  ) {

    this.isServer = isPlatformServer(platformId);

    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.userService.getCurrentUser();
      if (this.currentUser
        && this.userService.isTokenValid()
      ) {
        this.validUser = true;
        this.currentuserId = this.currentUser.userId;
      }
      this.setProfilePic();
    }

  }

  public paramType: any;
  public paramCategory: any;
  public paramModel: any;
  public paramId: any;

  public postsList: any = [];
  public showPostSpinner = false;
  public showContentLoader = false;

  public getPostsRequestBody = new GetPostsRequest();

  public categoryModalReference: NgbModalRef;
  closeResult: string;
  editPostForm: FormGroup;

  public postImages = [];
  public sectionsTypesMappings: any = [];
  public showMoreLink = true;
  public categories: any = [];
  public models: any = [];
  public types: any = [];
  public currentuserId: any;
  public isActivity: boolean = false;
  ngOnInit() {

    if (this.router.url.indexOf('/profile/self') !== -1 || this.router.url.indexOf("/profile/users/") !== -1) {
      this.isActivity = true;
    }

    this.seo.generateTags({
      title: 'SpurEd - Spur Encouragement to Education',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'feed-page'
    })
    this.userService.setTitle("SpurEd - Spur Encouragement to Education")

    this.commonService.menuChanges.subscribe(type => {
      if (type == "updateProfilePic") {
        this.setProfilePic();
      }
    })

    this.commonService.addPostInList.subscribe(
      postData => {
        if(this.postsList !== undefined){
          this.postsList.splice(0, 0, postData);
          this.noData = false;
        } else if(this.postsList === undefined){
		  this.postsList = [];
		  this.postsList.push(postData);
          this.noData = false;
		}
      }
    )

    this.sectionsTypesMappings = categories_types_models.SECTION_MAPPINGS;

    this.isMobile = this.mobileService.isMobile();
    if (this.isMobile) {
      this.windowStyle = { size: "lg" }
    } else {
      this.windowStyle = { windowClass: "myCustomModalClass" }
    }
    this.initEditForm();

    this.models = categories_types_models.MODELS;
    this.types = categories_types_models.TYPES;

    this.route.params.subscribe(this.handleParams.bind(this));
  }

  initEditForm() {
    this.editPostForm = this.formbuilder.group({
      context: this.formbuilder.group({
        section: [null, Validators.required]
      }),
      data: this.formbuilder.group({
        postId: [null, Validators.required],
        text: [null, Validators.required],
        title: [null, Validators.required],
        answer: [null]
      })
    });
  }

  initRequest() {
    this.getPostsRequestBody.pagination = new Pagination();;
    this.getPostsRequestBody.pagination.offset = 0

    this.getPostsRequestBody.context = new Context();
    this.getPostsRequestBody.context.section = 'ALL';

    this.getPostsRequestBody.data = new Data();
    this.getPostsRequestBody.data.category = null;
    this.getPostsRequestBody.data.model = null
  }


  handleParams(params: any[]) {
    this.goToTop();
    if (this.router.url.indexOf('boards/closed') !== -1) {
      this.boardId = params['boardId'];
      this.prepareBoardPostReq("board");
      this.seo.generateTags({
        title: 'SpurEd - Spur Encouragement to Education',
        description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
        slug: 'feed-page'
      })
      this.userService.setTitle("SpurEd - Spur Encouragement to Education")
    } else if (this.router.url.indexOf('/groups/') !== -1 && this.router.url.indexOf('posts/groups/') == -1) {
      this.groupId = params['groupId'];
      this.prepareBoardPostReq("group");
      this.seo.generateTags({
        title: 'SpurEd - Spur Encouragement to Education',
        description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
        slug: 'feed-page'
      })
      this.userService.setTitle("SpurEd - Spur Encouragement to Education")
    } else {
      this.paramType = params['type'];
      this.paramCategory = params['category'];
      this.paramModel = params['model'];
      if (this.paramType) {
        let paramT1 = this.paramType;
        let mappings = this.sectionsTypesMappings;
        let _typeArr = mappings.filter(item => item.section.toUpperCase() == paramT1.toUpperCase());
        if (_typeArr.length == 0) {
          alert("Sorry! Given url is wrong!");
          this.router.navigate(['/feed'])
          return;
        }
      }
      if (this.paramType && this.paramCategory == undefined) {
        this.paramCategory = "home"
      }
      if (this.router.url.indexOf("/profile/users/") !== -1) {
        this.profileParamId = params['id'];
      } else if (this.router.url.indexOf("/profile/self") !== -1) {
        this.profileParamId = this.currentuserId;
      } else {
        this.paramId = params['id'];
      }

      let sec = new Section();
      sec.section = this.paramType;
      sec.category = this.paramCategory;
      sec.model = this.paramModel;
      if (this.paramType == undefined && this.paramCategory == undefined) {
        this.initRequest()
        if (this.paramId) {
          if (this.router.url.indexOf("/posts/closed/") != -1) {
            this.paramType = "BOARD";
          } else if (this.router.url.indexOf("/posts/groups/") != -1) {
            this.paramType = "GROUP";
          }
          this.getPostDetails();
        } else {
          if (this.isActivity && this.currentuserId) {
            // alert("Activity")
            this.getActivity(this.currentuserId);
          } else {
            this.getPosts();
          }
        }
      } else {
        this.seo.generateTags({
          title: 'SpurEd - Spur Encouragement to Education',
          description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
          slug: 'feed-page'
        })
        this.userService.setTitle("SpurEd - Spur Encouragement to Education")
        this.selectedCategory(sec);
      }
    }
  }

  prepareBoardPostReq(type: any) {
    this.initRequest();
    if (type == "board") {
      this.getPostsRequestBody.data.boardId = this.boardId;
      this.getPostsRequestBody.context.section = "BOARD";
    } else {
      this.getPostsRequestBody.data.groupId = this.groupId;
      this.getPostsRequestBody.context.section = "GROUP";
    }
    this.getPosts();
  }

  private getDismissReason(reason: any): string {
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
      if (data.section) {
        // this.questionName = data.section.toUpperCase();
        this.getPostsRequestBody.context.section = data.section.toUpperCase();
      }
      if (data.category != 'home') {
        this.getPostsRequestBody.data.category = data.category;
        // this.questionName = this.questionName.toUpperCase() + " (" + data.category.toUpperCase() + ")";
      } else {
        this.getPostsRequestBody.data.category = null;
      }
      if (data.section) {
        this.getPostsRequestBody.context.section = data.section.toUpperCase();
      }
      if (data.model) {
        this.getPostsRequestBody.data.model = data.model;
      }
      if (this.paramId) {
        this.getPostDetails();
      } else {
        if (this.isActivity && this.currentuserId) {
          // alert("Activity")
          this.getActivity(this.currentuserId);
        } else {
          this.getPosts();
        }
      }
    }
  }


  getPosts() {
    this.showPostSpinner = true;
    this.showContentLoader = true;
    this.postsList = [];
    this.goToTop();

    /* server side rendring */
    if (this.tstate.hasKey(RESULT_KEY)) {
      console.log("browser : getting RESULT_KEY for posts");

      this.postsList = this.tstate.get(RESULT_KEY, '');
      //console.log(this.postsList);
      this.tstate.remove(RESULT_KEY);
      this.preparePostsList();
      this.showPostSpinner = false;

    } else if (this.isServer) {
      console.log("server : making service call & setting RESULT_KEY");

      this.service.getPostsList(this.getPostsRequestBody).subscribe(
        resData => {
          this.showPostSpinner = false;
          let obj: any = resData;
          if (obj.error && obj.error.code && obj.error.code.id) {
            console.log("Failed", obj.error.code.message);
            this.errorTextMessage = obj.error.code.message;
            setTimeout(() => {
              this.errorTextMessage = "";
            }, 15000);
          } else {
            this.postsList = obj.posts;
            this.tstate.set(RESULT_KEY, this.postsList);
            this.preparePostsList();
          }
        }, error => {
          console.log("Failed", "Something went wrong!");
          if (error.status === 0) {
            this.showPostSpinner = false;
            this.underMaintenace = false;
          }
        });


    } else {
      // console.log("no result received : making service call RESULT_KEY");

      this.service.getPostsList(this.getPostsRequestBody).subscribe(
        resData => {
          this.showPostSpinner = false;
          let obj: any = resData;
          if (obj.error && obj.error.code && obj.error.code.id) {
            // this.toastr.error("Failed", obj.error.code.message);
            this.errorTextMessage = obj.error.code.message;
            setTimeout(() => {
              this.errorTextMessage = "";
            }, 15000);
          } else {
            this.postsList = obj.posts;
            this.preparePostsList();
          }
        }, error => {
          this.toastr.error("Failed", "Something went wrong!");
          if (error.status === 0) {
            this.showPostSpinner = false;
            this.underMaintenace = false;
          }
        });
    }


  }

  loadMoreFeedPosts() {
    this.getPostsRequestBody.pagination.offset = 0;//this.getPostsRequestBody.pagination.offset + constant.postsPerCall;
    if (this.postsList !== undefined && this.postsList[this.postsList.length - 1]) {
      if (this.router.url.indexOf('feed') !== -1) {
        if (this.getPostsRequestBody.data.maxId == this.postsList[this.postsList.length - 1].upid) {
          return;
        }
        this.getPostsRequestBody.data.maxId = this.postsList[this.postsList.length - 1].upid;
      } else {
        if (this.getPostsRequestBody.data.maxId == this.postsList[this.postsList.length - 1].postId) {
          return;
        }
        this.getPostsRequestBody.data.maxId = this.postsList[this.postsList.length - 1].postId;
      }
    }
    this.showPostSpinner = true;
    this.service.getPostsList(this.getPostsRequestBody).subscribe(
      resData => {
        this.showPostSpinner = false;
        let obj: any = resData;
        if (obj.error && obj.error.code && obj.error.code.id) {
          this.toastr.error("Failed", obj.error.code.message);
        } else {
          if (obj && obj.posts && obj.posts.length == 0) {
            this.showMoreLink = false;
          }
          /* NEED TO CHANGE HERE :: every time it was checking this.postsList for duplicate
             HINT : array is in sorter order so we can check based on postId also

           */
          if(obj.posts){
            obj.posts.forEach(element => {
              if(this.postsList !== undefined){
                let existedArr = this.postsList.filter(item => item.postId == element.postId);
                if (existedArr.length == 0) {
                  this.postsList.push(element);
                }
              }
            });
            this.preparePostsList();
          }
        }
      }, error => {
        this.toastr.error("Failed", "Something went wrong!");
      })
  }


  loadMorePosts() {
    if (this.paramId) {
      return;
    }

    if (this.isActivity && this.from === 'topics') {
      this.loadMoreActivities('topics');
    } else if (this.isActivity && this.from === 'boards') {
      this.loadMoreActivities('boards');
    } else if (this.isActivity && this.from === 'groups') {
      this.loadMoreActivities('groups');
    } else {
      this.loadMoreFeedPosts();
    }

  }

  preparePostsList() {
    if (this.postsList && this.postsList.length > 0) {
      this.postsList = this.postsList.filter(item => item != null);
      this.postsList.forEach(element => {
        /* CHANGED :: added if condition to verify existing one or new one 
                      if existing one then no need to add any attributes */
        if (element) {
          if (element.maxLength === undefined)
            element.maxLength = constant.showSeeMorePostTextLenth;
          if (element.selectComments === undefined)
            element.selectComments = false;
          if (element.commentOffset === undefined)
            element.commentOffset = 0;
          if (element.comments === undefined)
            element.comments = [];
          if (element.commentsSpinner === undefined)
            element.commentsSpinner = false;
          if (element.commentText === undefined)
            element.commentText = null;
          if (element.viewAnswer === undefined)
            element.viewAnswer = false;
          if (element.videos === undefined)
            element.videos = [];
        }
      });
      this.noData = false;
    } else {
      this.noData = true;
    }

    setTimeout(() => {    //<<<---    using ()=> syntax
      this.showContentLoader = false;
    }, 3000);
  }

  getCommentsForPost(postId, index, event) {
    let reqBody = this.prepareGetComentsRequestBody(postId, index);
    this.postsList[index].commentOffset = 0;
    if (!this.postsList[index].selectComments) {
      this.postsList[index].selectComments = !this.postsList[index].selectComments;

      if (this.postsList[index].comments.length == 0) {
        if (this.postsList[index].commentsCount > 0) {
          this.postsList[index].commentsSpinner = true;
          this.service.getCommentsByPostId(reqBody).subscribe(resData => {
            this.postsList[index].commentsSpinner = false;
            let comments: any = resData;
            if (comments && comments.code && comments.code.id) {
              this.toastr.error("Failed", comments.code.longMessage);
            } else if (comments && comments.comments) {
              if (comments.comments.length > 0) {
                this.postsList[index].comments = comments.comments;
                this.postsList[index].comments.forEach(element => {
                  element.maxLength = constant.showSeeMorePostTextLenth;
                });
              }
            }
          }, error => {
            this.toastr.error("Failed", "Something went wrong!");
          })
        }
      }
    } else {
      this.postsList[index].selectComments = !this.postsList[index].selectComments;
    }
    event.preventDefault();
  }

  loadMoreComments(postId, index) {
    this.postsList[index].commentOffset = this.postsList[index].commentOffset;// + 3;
    this.postsList[index].commentsSpinner = true;
    let reqBody = this.prepareGetComentsRequestBody(postId, index);
    reqBody.pagination.offset = this.postsList[index].commentOffset;
    this.service.getCommentsByPostId(reqBody).subscribe(resData => {
      this.postsList[index].commentsSpinner = false;
      let comments: any = resData;
      if (comments && comments.code && comments.code.id) {
        this.toastr.error("Failed", comments.code.longMessage);
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
    }, error => {
      this.toastr.error("Failed", "Something went wrong!");
    })
  }

  showMoreCommentsChecker(comments, commentsCount) {
    // comments.length < 3 || 
    if (commentsCount < 3 || comments.length == commentsCount) {
      return false;
    }
    return true;
  }

  prepareGetComentsRequestBody(postId, index) {
    let postObj = this.postsList[index];
    let getCommentsRequest = new GetCommentRequest();
    let arrTypes = this.sectionsTypesMappings.filter(item => (postObj && item._type == postObj._type));
    getCommentsRequest.context = new CommentContext();
    getCommentsRequest.context.section = arrTypes[0].section;
    getCommentsRequest.data = new CreateCommentData();
    getCommentsRequest.data.postId = postId;
    getCommentsRequest.data._type = "GetComment";
    if (postObj.comments.length > 0) {
      getCommentsRequest.data.maxId = postObj.comments[postObj.comments.length - 1].commentId;
    }
    getCommentsRequest.pagination = new Pagination();
    getCommentsRequest.pagination.offset = 0;
    getCommentsRequest.pagination.limit = constant.commentsPerCall;
    return getCommentsRequest;
  }

  createComment(commentText, index) {
    let createCommentRequest = new CreateCommentRequest();
    let postObj = this.postsList[index];
    let arrTypes = this.sectionsTypesMappings.filter(item => (postObj && item._type == postObj._type));
    createCommentRequest.context = new CommentContext();
    createCommentRequest.context.section = arrTypes[0].section;

    createCommentRequest.data = new CreateCommentData();
    createCommentRequest.data.postId = postObj.postId;
    createCommentRequest.data.text = commentText.trim();
    createCommentRequest.data._type = "Comment";

    this.service.createComment(createCommentRequest).subscribe((resData: any) => {

      if (resData && resData.code && resData.code.id) {
        this.toastr.error("Failed", resData.code.longMessage);
      } else if (resData && resData.error && resData.error.code && resData.error.code.id) {
        this.toastr.error("Failed", resData.error.code.longMessage);
      }
      else {
        this.postsList[index].commentText = null;
        resData.comment.maxLength = constant.showSeeMoreCommentTextLenth;
        this.postsList[index].comments.splice(0, 0, resData.comment);
        this.postsList[index].commentsCount = this.postsList[index].commentsCount + 1;
        this.toastr.success("Comment Success", "Comment added successfully");
      }
    }, error => {
      this.toastr.error("Failed", "Something went wrong!");
    })
  }

  deletePost(postId: any, postType: any) {
    let index = this.postsList.findIndex(item => (item.postId == postId && item._type == postType));
    let postObj = this.postsList[index];

    this.editPostForm.controls['data'].get('postId').patchValue(postObj.postId);
    let typeAr = this.sectionsTypesMappings.filter(item => (postObj && item._type == postObj._type));
    if (typeAr.length > 0) {
      this.editPostForm.controls['context'].get('section').patchValue(typeAr[0].section);
    }

    this.confirmService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.service.deletePost(this.editPostForm.value).subscribe(resData => {
          let obj: any = resData;
          if (obj.error && obj.error.code && obj.error.code.id) {
            this.toastr.error("Failed", obj.error.code.message);
          } else {
            this.postsList.splice(index, 1);
            this.toastr.success("Success", "Post deleted successfully");
          }
        }, error => {
          this.toastr.error("Failed", "Something went wrong!");
        })
      }
    });
  }

  editPost(postId: any, type: any, content: any) {
    this.postsList.forEach(element => {
      if (element && element.postId == postId && element._type == type) {
        this.editPostForm.controls['data'].get('text').patchValue(element.postText.trim());
        this.editPostForm.controls['data'].get('title').patchValue(element.postTitle);
        this.editPostForm.controls['data'].get('postId').patchValue(element.postId);
        let type = this.sectionsTypesMappings.filter(item => item._type == element._type)[0].section;
        this.editPostForm.controls['context'].get('section').patchValue(type);
        if (type != "CAREERS" && type != "EVENTS") {
          this.editPostForm.controls['data'].get('answer').patchValue(element.postAnswer);
        }
      }
    });

    this.categoryModalReference = this.modalService.open(content, this.windowStyle);
    this.categoryModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  saveEditPost() {
    this.service.saveEditPost(this.editPostForm.value).subscribe(resData => {
      let obj: any = resData;
      if (obj.error && obj.error.code && obj.error.code.id) {
        this.toastr.error("Failed", obj.error.code.message);
      } else {
        if (obj && obj.posts.length > 0) {
          if (obj.posts[0].postId) {
            this.postsList.forEach(element => {
              if (element.postId == this.editPostForm.controls['data'].get('postId').value) {
                element.postText = this.editPostForm.controls['data'].get('text').value
                element.postTitle = this.editPostForm.controls['data'].get('title').value
                element.postAnswer = this.editPostForm.controls['data'].get('answer').value
              }
            });
            this.toastr.success("Update success", "Post updated successfully");
            this.categoryModalReference.close();
          }
        }
      }
    }, error => {
      this.toastr.error("Failed", "Something went wrong!");
    })
  }

  navigateToPostDetails(postObj: any) {
    window.open(this.getPostTitleUrl(postObj), "_blank")
  }

  getPostTitleUrl(postObj: any) {
    let t = this.sectionsTypesMappings.filter(item => item._type == postObj._type)[0].section;
    let c = postObj.category;
    let id = postObj.postId;
    let title = postObj.postTitle;
    let postUrl;
    if (isPlatformBrowser(this.platformId)) {
      if (postObj.postType == "QUIZ") {
        if (this.currentUser.userId == postObj.userProfile.userId) {
          postUrl = "/quiz-manage/closed/" + id;
        } else {
          postUrl = "/quiz/closed/" + id;
        }
      } else {
        if (t == "BOARD") {
          postUrl = "/posts/closed/" + id + "/" + (title != undefined ? (title.replace(/[^a-zA-Z0-9]/g, '-')) : "");

        } else if (t == "GROUP") {
          postUrl = "/posts/groups/" + id + "/" + (title != undefined ? (title.replace(/[^a-zA-Z0-9]/g, '-')) : "");
        } else {
          if (c) {
            if (title != undefined) {
              postUrl = "/posts/" + t.toLowerCase() + "/" + c + "/" + id + "/" + title.replace(/[^a-zA-Z0-9]/g, '-');
            } else {
              postUrl = "/posts/" + t.toLowerCase() + "/" + c + "/" + id;
            }
          } else {
            if (title != undefined) {
              postUrl = "/posts/" + t + "/" + id + "/" + title.replace(/[^a-zA-Z0-9]/g, '-');
            } else {
              postUrl = "/posts/" + t + "/" + id;
            }
          }
        }

      }
      return postUrl;
    }
    return "/feed"
  }

  generatePostById() {
    if (this.postsList.length > 0) {
      this.seo.generateTags({
        title: 'SpurEd - Spur Encouragement to Education',
        description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
        slug: 'feed-page'
      })
      this.userService.setTitle("SpurEd - Spur Encouragement to Education")

      // Chaning postDeatail url
      let arrUrl = this.router.url.split("/");
      let newUrl = "";
      for (let i = 0; i < arrUrl.length - 1; i++) {
        if (arrUrl[i] != undefined) {
          newUrl = newUrl + arrUrl[i] + "/"
        } else {
          newUrl = "/" + newUrl
        }
      }
      let num: any = arrUrl[arrUrl.length - 1];
      if (!isNaN(num)) {
        newUrl = newUrl + arrUrl[arrUrl.length - 1] + "/";
      }
      if (this.postsList[0].postTitle) {
        this.location.replaceState(newUrl + this.postsList[0].postTitle.replace(/[^a-zA-Z0-9]/g, '-'));
      }
      this.preparePostsList();
    } else {
      // this.toastr.error("Failed", "The post your looking is deleted");
      this.router.navigate(['/not-found'])
    }
  }

  getPostDetails() {
    let paramTypeD = this.paramType.toUpperCase();

    /* server side rendring */
    if (this.tstate.hasKey(RESULTBYID_KEY)) {
      console.log("browser : getting RESULTBYID_KEY for posts");

      this.postsList = this.tstate.get(RESULTBYID_KEY, '');
      this.tstate.remove(RESULTBYID_KEY);
      this.generatePostById();

    } else if (this.isServer) {
      console.log("server : making service call & setting RESULTBYID_KEY");

      this.service.getPostDetailsById(this.paramId, paramTypeD).subscribe((resData: any) => {
        let obj: any = resData;
        if (obj.error && obj.error.code && obj.error.code.id) {
          this.toastr.error("Failed", obj.error.code.message);
        } else {
          this.postsList = resData.posts;
          this.tstate.set(RESULTBYID_KEY, this.postsList);
          this.generatePostById();
        }
      }, error => {
        this.toastr.error("Failed", "Something went wrong!");
      });


    } else {
      console.log("no result received : making service call RESULTBYID_KEY");

      this.service.getPostDetailsById(this.paramId, paramTypeD).subscribe((resData: any) => {
        let obj: any = resData;
        if (obj.error && obj.error.code && obj.error.code.id) {
          this.toastr.error("Failed", obj.error.code.message);
        } else {
          this.postsList = resData.posts;
          this.generatePostById();
        }
      }, error => {
        this.toastr.error("Failed", "Something went wrong!");
      });

    }
  }


  redirectToOtherProfile(userId: any) {
    this.router.navigate(['profile/users/' + userId]);
  }



  getTypeFrom_Type(_type: any) {
    let t = "Others";
    let mappings = this.sectionsTypesMappings;
    let _typeArr = mappings.filter(item => item._type.toUpperCase() == _type.toUpperCase());
    if (_typeArr.length > 0) {
      t = _typeArr[0].section;
    }
    return t;
  }



  getSectionFromType(_type: any) {
    let t = "Others";
    let mappings = this.sectionsTypesMappings;
    let _typeArr = mappings.filter(item => item._type.toUpperCase() == _type.toUpperCase());
    if (_typeArr.length > 0) {
      t = _typeArr[0].name;
    }
    return t;
  }

  getModelFromTypeCategory(_type: any, category: any): string {
    let type = this.getSectionFromType(_type);
    let model = "Others"
    categories_types_models.SECTIONS.forEach(sec => {
      if (sec.title == "Topics") {
        sec.sections.forEach((ty:any) => {
          if (ty.name.toUpperCase() == type.toUpperCase()) {
            ty.categories.forEach((ca:any) => {
              if (ca.code == category) {
                model = ca.name;
              }
            })
          }
        })
      }
    });
    return model;
  }

  getModelFromTypeModel(_type: any, modelValue: any): string {
    let type = this.getSectionFromType(_type);
    let model = "Others"
    //Below condition is for: same verbal and quants have same models
    if (type == "Quants") {
      type = "Verbal";
    }
    this.models.forEach(sec => {
      if (sec.type.toUpperCase() == type.toUpperCase() || sec.name.toUpperCase() === type.toUpperCase()) {
        sec.models.forEach(element => {
          if (element.value.toUpperCase() == modelValue.toUpperCase()) {
            model = element.label
          }
        });
      }
    });
    return model;
  }

  goToCategoriesPage(_type: any, category: any, model: any) {
    let url = this.getPageUrl(_type, category, model);
    this.router.navigate([url])
  }

  getPageUrl(_type: any, category: any, model: any) {
    let section = this.getTypeFrom_Type(_type);
    let url = 'categories/' + section.toLowerCase();
    if (category != null) {
      url = url + "/" + category;
    }
    if (model != null) {
      url = url + "/" + model;
    }
    return url;
  }

  getBoardPageUrl(boardId: any, boardName: any) {
    let url = "/boards/closed/" + boardId + "/" + boardName
    return url;
  }

  goToBoardsPage(boardId: any, boardName: any) {
    let url = this.getBoardPageUrl(boardId, boardName);
    this.router.navigate([url])
  }

  getGroupPageUrl(groupId: any, groupName: any) {
    let url = "/gropus/" + groupId + "/" + groupName
    return url;
  }

  goToGroupPage(groupId: any, groupName: any) {
    let url = this.getGroupPageUrl(groupId, groupName);
    this.router.navigate([url])
  }

  setProfilePic() {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser && this.currentUser.imageUrl) {
      this.profileImage = this.currentUser.imageUrl;
    } else {
      this.profileImage = "assets/images/noticer_default_user_img.png"
    }
  }

  goToTop() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

  onNavigate(link: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (link.indexOf("http") != -1) {
        window.open(link)
      } else {
        window.open("http://" + link)
      }
    }
  }


  imageFromAws(url) {
    return url.indexOf("https://") != -1 ? true : false;
  }

  public shareUrl = "";
  copyMethod(postObj: any) {

    let t = this.sectionsTypesMappings.filter(item => item._type == postObj._type)[0].section;
    let c = postObj.category;
    let id = postObj.postId;
    let title = postObj.postTitle;
    if (isPlatformBrowser(this.platformId)) {
      if (t == "BOARD") {
        let postUrl = "/posts/closed/" + id + "/" + (title != undefined ? (title.replace(/[^a-zA-Z0-9]/g, '-')) : "");
        this.shareUrl = postUrl;
      } else if (t == "GROUP") {
        let postUrl = "/posts/groups/" + id + "/" + (title != undefined ? (title.replace(/[^a-zA-Z0-9]/g, '-')) : "");
        this.shareUrl = postUrl;
      } else {
        if (c) {
          if (title != undefined) {
            this.shareUrl = "/posts/" + t.toLowerCase() + "/" + c + "/" + id + "/" + title.replace(/[^a-zA-Z0-9]/g, '-');
          } else {
            this.shareUrl = "/posts/" + t.toLowerCase() + "/" + c + "/" + id
          }
        } else {
          if (title != undefined) {
            this.shareUrl = "/posts/" + t + "/" + id + "/" + title.replace(/[^a-zA-Z0-9]/g, '-');
          } else {
            this.shareUrl = "/posts/" + t + "/" + id;
          }
        }
      }
    }

    var textToCopy = document.createElement('textarea');
    textToCopy.value = constant.domainName + this.shareUrl;
    if (textToCopy) {
      document.body.appendChild(textToCopy);
      textToCopy.select();
      document.execCommand('copy');
      document.body.removeChild(textToCopy);
      this.toastr.info("Link copied successfully");
    }
  }

  deleteComment(postId, postType, commentId) {

    let postIndex = this.postsList.findIndex(item => (item.postId == postId && item._type == postType));
    let postObj = this.postsList[postIndex];
    let getCommentsRequest = new GetCommentRequest();
    let arrTypes = this.sectionsTypesMappings.filter(item => (postObj && item._type == postObj._type));

    let commentIndex = postObj.comments.findIndex(item => item.commentId == commentId);

    getCommentsRequest.context = new CommentContext();
    getCommentsRequest.context.section = arrTypes[0].section;
    getCommentsRequest.data = new CreateCommentData();
    getCommentsRequest.data._type = "Comment";
    getCommentsRequest.data.commentId = commentId;



    this.confirmService.confirm({
      message: 'Are you sure you want to delete?',
      accept: () => {
        this.service.deleteComment(getCommentsRequest).subscribe(resData => {
          let obj: any = resData;
          if (obj.error && obj.error.code && obj.error.code.id) {
            this.toastr.error("Failed", obj.error.code.message);
          } else {
            this.postsList[postIndex].comments.splice(commentIndex, 1);
            this.postsList[postIndex].commentsCount = this.postsList[postIndex].commentsCount - 1;
            this.toastr.success("Success", "Comment deleted successfully");
          }
        }, error => {
          this.toastr.error("Failed", "Something went wrong!");
        })
      }
    });
  }



  upVote(postId: any, postType: any, event) {
    if (!this.validUser) {
      this.router.navigate(['/home'])
      return false;
    }
    let index = this.postsList.findIndex(item => (item.postId == postId && item._type == postType));
    let postObj = this.postsList[index];
    if (postObj.postId != postId) {
      this.toastr.error("Failed", "Something went wrong!");
      return;
    }
    let arrTypes = this.sectionsTypesMappings.filter(item => (postObj && item._type == postObj._type));
    let body: any = {
      "record": {
        "_type": "ActionRecord",
        "entityType": "POST",
        "entitySection": arrTypes[0].section,
        "actionValue": "UP",
        "targetId": postId
      }
    };

    this.postsList[index].actionAttributes.upVoteCount += 1;
    this.postsList[index].actionAttributes.upVoted = true;

    this.service.createLike(body).subscribe((resData: any) => {
      if (resData && resData.error && resData.error.code && resData.error.code.id) {
        this.toastr.error("Failed", resData.error.code.longMessage);
        this.postsList[index].actionAttributes.upVoteCount -= 1;
        this.postsList[index].actionAttributes.upVoted = false;
      } else if (resData && resData.actionRecords && resData.actionRecords.length > 0) {
        console.log(resData);
        this.postsList[index].actionAttributes.voteId = resData.actionRecords[0].id;
        /* CHAGNED :: Removed success toast message */
        //this.toastr.success("Success", "Post liked successfully");
      }
    })
    event.preventDefault();
  }

  cancelVote(postId: any, postType: any, event) {
    if (!this.validUser) {
      this.router.navigate(['/home'])
      return false;
    }
    let index = this.postsList.findIndex(item => (item.postId == postId && item._type == postType));
    let postObj = this.postsList[index];
    if (postObj.postId != postId) {
      this.toastr.error("Failed", "Something went wrong!");
      return;
    }
    let arrTypes = this.sectionsTypesMappings.filter(item => (postObj && item._type == postObj._type));
    let body: any = {
      "record": {
        "_type": "ActionRecord",
        "entityType": "POST",
        "entitySection": arrTypes[0].section,
        "actionValue": "UP",
        "id": postObj.actionAttributes.voteId
      }
    };


    this.service.cancelLike(body).subscribe((resData: any) => {
      if (resData && resData.error && resData.error.code && resData.error.code.id) {
        this.toastr.error("Failed", resData.error.code.longMessage);
      } else if (resData && resData.actionRecords && resData.actionRecords.length > 0) {
        this.postsList[index].actionAttributes.upVoteCount -= 1;
        this.postsList[index].actionAttributes.upVoted = false;
      }
    })
    event.preventDefault();
  }

  createFavorite(postId: any, postType: any, event) {
    if (!this.validUser) {
      this.router.navigate(['/home'])
      return false;
    }
    let index = this.postsList.findIndex(item => (item.postId == postId && item._type == postType));
    let postObj = this.postsList[index];
    if (postObj.postId != postId) {
      this.toastr.error("Failed", "Something went wrong!");
      return;
    }
    let arrTypes = this.sectionsTypesMappings.filter(item => (postObj && item._type == postObj._type));
    let body: any = {
      "record": {
        "_type": "ActionRecord",
        "entityType": "POST",
        "entitySection": arrTypes[0].section,
        "targetId": postId
      }
    };

    this.postsList[index].actionAttributes.favoriteCount += 1;
    this.postsList[index].actionAttributes.favorited = true;

    this.service.createFavorite(body).subscribe((resData: any) => {
      if (resData && resData.error && resData.error.code && resData.error.code.id) {
        this.toastr.error("Failed", resData.error.code.longMessage);
        this.postsList[index].actionAttributes.favoriteCount -= 1;
        this.postsList[index].actionAttributes.favorited = false;
      } else if (resData && resData.actionRecords && resData.actionRecords.length > 0) {
        console.log(resData);
        this.postsList[index].actionAttributes.favoriteId = resData.actionRecords[0].id;
        /* CHAGNED :: Removed success toast message */
        //this.toastr.success("Success", "Post favorited successfully");
      }
    })
    event.preventDefault();
  }

  cancelFavorite(postId: any, postType: any, event) {
    if (!this.validUser) {
      this.router.navigate(['/home'])
      return false;
    }
    let index = this.postsList.findIndex(item => (item.postId == postId && item._type == postType));
    let postObj = this.postsList[index];
    if (postObj.postId != postId) {
      this.toastr.error("Failed", "Something went wrong!");
      return;
    }
    let arrTypes = this.sectionsTypesMappings.filter(item => (postObj && item._type == postObj._type));
    let body: any = {
      "record": {
        "_type": "ActionRecord",
        "entityType": "POST",
        "entitySection": arrTypes[0].section,
        "id": postObj.actionAttributes.favoriteId
      }
    };


    this.service.cancelFavorite(body).subscribe((resData: any) => {
      if (resData && resData.error && resData.error.code && resData.error.code.id) {
        this.toastr.error("Failed", resData.error.code.longMessage);
      } else if (resData && resData.actionRecords && resData.actionRecords.length > 0) {
        this.postsList[index].actionAttributes.favoriteCount -= 1;
        this.postsList[index].actionAttributes.favorited = false;
        console.log(resData);
      }
    })
    event.preventDefault();
  }


  createReport(postId: any, postType: any) {
    let index = this.postsList.findIndex(item => (item.postId == postId && item._type == postType));
    let postObj = this.postsList[index];
    if (postObj.postId != postId) {
      this.toastr.error("Failed", "Something went wrong!");
      return;
    }
    let arrTypes = this.sectionsTypesMappings.filter(item => (postObj && item._type == postObj._type));
    let body: any = {
      "record": {
        "_type": "ActionRecord",
        "entityType": "POST",
        "entitySection": arrTypes[0].section,
        "targetId": postId
      }
    };
    this.service.createReport(body).subscribe((resData: any) => {
      if (resData && resData.error && resData.error.code && resData.error.code.id) {
        this.toastr.error("Failed", resData.error.code.longMessage);
      } else if (resData && resData.actionRecords && resData.actionRecords.length > 0) {
        this.toastr.success("Success", "Reported successfully");
      }
    })
  }

  getActivity(userId: any) {
    let body: any;
    if (this.from == "topics") {
      body = {
        "record": {
          "_type": "ActivityRecord",
          "userId": this.profileParamId
        }
      }
    } else if (this.from == "groups") {
      body = {
        "record": {
          "_type": "ActivityRecord",
          "entitySection": "GROUP",
          "userId": this.profileParamId
        }
      }
    } else if (this.from == "boards") {
      body = {
        "record": {
          "_type": "ActivityRecord",
          "entitySection": "BOARD",
          "userId": this.profileParamId
        }
      }
    }
    body.pagination = new Pagination();
    body.pagination.offset = 0
    body.pagination.limit = 30

    this.service.getSelfActivity(body).subscribe(resData => {
      this.showPostSpinner = false;
      let obj: any = resData;
      if (obj.error && obj.error.code && obj.error.code.id) {
        console.log("Failed", obj.error.code.message);
      } else {
        let records = this.prepareActivity(resData);
        this.postsList = records;
        if (this.postsList.length == 0) {
          this.showMoreActivity = false;
        }
        this.preparePostsList();
      }
    }, error => {
      console.log("Failed", "Something went wrong!");
      if (error.status === 0) {
        this.showPostSpinner = false;
        this.underMaintenace = false;
      }
    });
  }

  loadMoreActivities(type: any) {
    let body: any;
    if (type == "topics") {
      body = {
        "record": {
          "_type": "ActivityRecord",
          "userId": this.profileParamId
        }
      }
    } else if (type == "groups") {
      body = {
        "record": {
          "_type": "ActivityRecord",
          "entitySection": "GROUP",
          "userId": this.profileParamId
        }
      }
    } else if (type == "boards") {
      body = {
        "record": {
          "_type": "ActivityRecord",
          "entitySection": "BOARD",
          "userId": this.profileParamId
        }
      }
    } else {
      return;
    }
    body.pagination = new Pagination();
    body.pagination.offset = 0
    body.pagination.limit = 30
    if ((this.activeTab == 0 && this.from == "topics") ||
      (this.activeTab == 1 && this.from == "boards") ||
      (this.activeTab == 2 && this.from == "groups")) {
      if (this.postsList[this.postsList.length - 1]) {
        let post = this.postsList[this.postsList.length - 1];
        console.log("Activity");
        console.log(post.activity);
        console.log("sort");
        post.activity.sort(function (a, b) {
          return a.id - b.id;
        });
        console.log(post.activity);
        if (body.pagination.maxId == post.activity[0].id) {
          return;
        }
        body.pagination.maxId = post.activity[0].id;
      }
      this.showPostSpinner = true;
      this.service.getSelfActivity(body).subscribe(
        resData => {
          this.showPostSpinner = false;
          let obj: any = resData;
          if (obj.error && obj.error.code && obj.error.code.id) {
            this.toastr.error("Failed", obj.error.code.message);
          } else {
            let records = this.prepareActivity(resData);
            if (records.length == 0) {
              this.showMoreActivity = false;
            }
            /* NEED TO CHANGE HERE :: every time it was checking this.postsList for duplicate
               HINT : array is in sorter order so we can check based on postId also
  
             */
            records.forEach(element => {
              // let existedArr = this.postsList.filter(item => item.postId == element.postId);
              // if (existedArr.length == 0) {
              this.postsList.push(element);
              // }
            });
            this.preparePostsList();
          }
        }, error => {
          this.toastr.error("Failed", "Something went wrong!");
        })
    }
  }

  prepareActivity(activityRecords: any) {
    let records: any = [];
    if (activityRecords && activityRecords.activityEntities && activityRecords.activityEntities.length > 0) {
      activityRecords.activityEntities.forEach(element => {
        let post: any;
        post = element.post;
        post.activity = element.activity;
        records.push(post);
      });
    }
    return records;
  }
  /* CHANGE :: Need to change this rendering

    HIND :: insted of string appending need to use one array and put every thing on it & check same thing is already there or not 
            finally use array.join() to dispaly

  */
  getActivityName(actList) {
    let act = "";
    if (actList) {
      actList.forEach(activity => {
        if (activity) {
          if (activity.action == "CREATE" && activity.entityType == "POST") {
            if (act.indexOf('Posted') !== -1) {
              act = act.replace('Posted,', '');
            }
            act = act + "Posted";
          } else if (activity.action == "CREATE" && activity.entityType == "COMMENT") {
            if (act.indexOf('Commented,') !== -1) {
              act = act.replace('Commented,', '');
            }
            act = act + "Commented";
          } else if (activity.action == "VOTE") {
            if (act.indexOf('Liked') !== -1) {
              act = act.replace('Liked,', '');
            }
            act = act + "Liked";
          } else if (activity.action == "FAVORITE") {
            if (act.indexOf('Favorited') !== -1) {
              act = act.replace('Favorited,', '');
            }
            act = act + "Favorited";
          } else if (activity.action == "REPORT") {
            if (act.indexOf('Reported') !== -1) {
              act = act.replace('Reported,', '');
            }
            act = act + "Reported";
          }else if (activity.action == "ATTEMPTED") {
            if (act.indexOf('Attempted') !== -1) {
              act = act.replace('Attempted,', '');
            }
            act = act + "Attempted";
          }
        }

        if (actList.length > 1 && actList[actList.length - 1].id != activity.id) {
          act = act + ", ";
        }

      });
    }
    return act;
  }

  ytVidId(url) {
    let p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
  }

  createYouTubeEmbedLink(link, videoId) {
    if (link !== undefined && link !== null && link !== "") {
      return "https://youtube.com/embed/" + videoId;
      //Need to check for diffarent types of Youtube videos 
      /*if(link.indexOf("/embed/") >0){
        return link;
      }else{
        link = link.replace("youtu.be/","youtube.com/embed/")
        link = link.replace("youtube.com/watch?v=", "youtube.com/embed/");
      }*/
    }
  }

  formatPostText(post) {
    if (post.postText === undefined || post.postText === null || post.postText === "" || post.postText.indexOf("http") === -1)
      return post.postText;

    let text = "";
    if (post.postText)
      text = post.postText.slice(0, post.maxLength);


    let urlRegex = /(https?:\/\/[^\s]+)/g;
    let _this = this;
    return text.replace(urlRegex, function (url) {
      let videoId = _this.ytVidId(url);
      if (videoId) {
        url = _this.createYouTubeEmbedLink(url, videoId);
        if (post && post.videos === undefined) {
          post["videos"] = [];
          post["videos"].push(url);
        } else {
          post["videos"].push(url);
        }

        return '';
      } else {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
      }
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  };


  load(type: any) {
    alert(type);
  }

  calulateDateAndTime(dateValue: any, returnType: string) {
    let one_day = 1000 * 60 * 60 * 24;
    let today = new Date();
    let today_ms = today.getTime();
    let result: any = "";

    switch (returnType) {

      case "daysLeft": {
        if (dateValue !== undefined && dateValue !== "") {
          dateValue = new Date(dateValue);
          let dateValue_ms: any = dateValue.getTime();
          let dateDiff: any = dateValue_ms - today_ms;//(today_ms >= dateValue_ms ) ? (today_ms - dateValue_ms) :  (dateValue_ms - today_ms);
          result = Math.round(dateDiff / one_day);

          result = (result <= 0) ? "0 Days" : result;
          if (result !== "0 Days")
            result = (result == 1) ? result + " Day" : result + " Days";
          result = (result === "0 Days") ? '<span class="text-danger">' + result + '</span>' : '<span class="text-success">' + result + '</span>';
        }

        break;
      }

      default: {
        break;
      }
    }

    return result;

  }


  postImagesAvailablitiyCheck(post: any) {
    // setTimeout(() => {
    //Your expression to change if state
    return (post.files && post.files.length > 0) ||
      (post.images && post.images.length > 0) ||
      (post.videos && post.videos.length > 0)
    // }, 2000);
  }
}
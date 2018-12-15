import { isPlatformBrowser, Location } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { NoticerMainService } from './noticer-main.service';


@Component({
  selector: 'noticer-main',
  templateUrl: './noticer-main.component.html',
  styleUrls: ['./noticer-main.component.css'],
  providers: [NoticerMainService, CustomValidator, ConfirmationService, SeoService, ToastrService]
})
export class NoticerMainComponent implements OnInit {

  @ViewChild('sideMenuDialogDialog') sideMenuModalCotent: any;
  @ViewChild('postDialog') postDialog: ElementRef;

  public isMobile: boolean;
  public profileImage: any;
  public currentUser: User;
  public validUser: boolean = false;
  public noData: boolean = false;
  public boardId: any;
  public reqestType: string;
  constructor(private router: Router, private formbuilder: FormBuilder,
    private service: NoticerMainService,
    private userService: CurrentUserService,
    public mobileService: MobileDetectionService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private confirmService: ConfirmationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService, private location: Location,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.userService.getCurrentUser();
      this.serverUrl = constant.REST_API_URL + "/";
      if (this.currentUser) {
        this.validUser = true;
        this.currentuserId = this.currentUser.userId;
      }
      this.setProfilePic();
    }
  }

  public paramType: any;
  public paramCategory: any;
  public paramId: any;

  public postsList: any = [];
  public showPostSpinner = false;

  public getPostsRequestBody = new GetPostsRequest();

  public categoryModalReference: NgbModalRef;
  closeResult: string;


  editPostForm: FormGroup;

  public postImages = [];
  public sectionsTypesMappings: any = [];
  public showMoreLink = true;
  public serverUrl;
  public categories: any = [];
  public models: any = [];
  public types: any = [];
  public currentuserId: any;
  ngOnInit() {
    this.seo.generateTags({
      title: 'Noticer feed | Posts and comments',
      description: 'Noticer posts and comments',
      slug: 'feed-page'
    })

    this.commonService.menuChanges.subscribe(type => {
      if (type == "updateProfilePic") {
        this.setProfilePic();
      }
    })

    this.commonService.addPostInList.subscribe(
      postData => {
        this.postsList.splice(0, 0, postData);
        this.noData = false;
      }
    )

    this.userService.setTitle("Noticer | Posts and comments");

    this.sectionsTypesMappings = categories_types_models.SECTION_MAPPINGS;

    this.isMobile = this.mobileService.isMobile();
    this.initEditForm();

    this.models = categories_types_models.MODELS;
    this.types = categories_types_models.TYPES;

    this.route.params.subscribe(this.handleParams.bind(this));
  }

  initEditForm() {
    this.editPostForm = this.formbuilder.group({
      context: this.formbuilder.group({
        type: [null, Validators.required]
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
    this.getPostsRequestBody.context.type = 'ALL';

    this.getPostsRequestBody.data = new Data();
    this.getPostsRequestBody.data.category = null;
    this.getPostsRequestBody.data.model = null
  }


  handleParams(params: any[]) {
    this.goToTop();
    if (this.router.url.indexOf('boards/closed') !== -1) {
      this.boardId = params['boardId'];
      this.prepareBoardPostReq(params['title']);
      this.seo.generateTags({
        title: 'Closed board posts',
        description: 'All about closed board posts',
        slug: 'boards-page'
      })
      this.userService.setTitle("Noticer | Closed board posts and comments");
    } else {
      this.paramType = params['type'];
      this.paramCategory = params['category'];
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
      this.paramId = params['id'];

      let sec = new Section();
      sec.section = this.paramType;
      sec.category = this.paramCategory
      if (this.paramType == undefined && this.paramCategory == undefined) {
        this.initRequest()
        if (this.paramId) {
          if (this.router.url.indexOf("/posts/closed/") != -1) {
            this.paramType = "BOARD";
          }
          this.getPostDetails();
        } else {
          this.getPosts();
        }
      } else {
        this.seo.generateTags({
          title: this.paramType,
          description: this.paramType + " posts and comments",
          slug: this.paramType + '-page'
        })
        this.userService.setTitle("Noticer | " + this.paramType + " posts and comments");
        this.selectedCategory(sec);
      }
    }
  }

  prepareBoardPostReq(boardTitle: any) {
    this.initRequest();
    this.getPostsRequestBody.data.boardId = this.boardId;
    this.getPostsRequestBody.context.type = "BOARD";
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
        this.getPostsRequestBody.context.type = data.section.toUpperCase();
      }
      if (data.category != 'home') {
        this.getPostsRequestBody.data.category = data.category;
        // this.questionName = this.questionName.toUpperCase() + " (" + data.category.toUpperCase() + ")";
      } else {
        this.getPostsRequestBody.data.category = null;
      }
      if (data.section) {
        this.getPostsRequestBody.context.type = data.section.toUpperCase();
      }
      if (this.paramId) {
        this.getPostDetails();
      } else {
        this.getPosts();
      }
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
          this.toastr.error("Failed", obj.error.code.message);
        } else {
          this.postsList = obj.posts;
          this.preparePostsList();
        }
      }, error => {
        this.toastr.error("Failed", "Something went wrong!");
      })
  }

  loadMorePosts() {
    this.getPostsRequestBody.pagination.offset = this.getPostsRequestBody.pagination.offset + constant.postsPerCall;
    this.showPostSpinner = true;
    this.service.getPostsList(this.getPostsRequestBody).subscribe(
      resData => {
        this.showPostSpinner = false;
        let obj: any = resData;
        if (obj.error && obj.error.code && obj.error.code.id) {
          this.toastr.error("Failed", obj.error.code.message);
        } else {
          if (obj.posts.length < constant.postsPerCall) {
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
      }, error => {
        this.toastr.error("Failed", "Something went wrong!");
      })
  }

  preparePostsList() {
    if (this.postsList.length > 0) {
      this.postsList = this.postsList.filter(item => item != null);
      this.postsList.forEach(element => {
        if (element) {
          element.maxLength = constant.showSeeMorePostTextLenth;
          element.selectComments = false;
          element.commentOffset = 0;
          element.comments = [];
          element.commentsSpinner = false;
          element.commentText = null;
          element.viewAnswer = false;
        }
      });
      this.noData = false;
    } else {
      this.noData = true;
    }
  }

  getCommentsForPost(postId, index) {
    let reqBody = this.prepareGetComentsRequestBody(postId, index);
    this.postsList[index].commentOffset = 0;
    if (!this.postsList[index].selectComments) {
      this.postsList[index].selectComments = !this.postsList[index].selectComments;
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
    } else {
      this.postsList[index].selectComments = !this.postsList[index].selectComments;
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
    if (comments.length < 3 || comments.length == commentsCount) {
      return false;
    }
    return true;
  }

  prepareGetComentsRequestBody(postId, index) {
    let postObj = this.postsList[index];
    let getCommentsRequest = new GetCommentRequest();
    let arrTypes = this.sectionsTypesMappings.filter(item => (postObj && item._type == postObj._type));
    getCommentsRequest.context = new CommentContext();
    getCommentsRequest.context.postId = postId;
    getCommentsRequest.context.type = arrTypes[0].section;
    getCommentsRequest.data = {};
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
    createCommentRequest.context.type = arrTypes[0].section;
    createCommentRequest.context.postId = postObj.postId;

    createCommentRequest.data = new CreateCommentData();
    createCommentRequest.data.text = commentText;
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
      this.editPostForm.controls['context'].get('type').patchValue(typeAr[0].section);
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
        this.editPostForm.controls['data'].get('text').patchValue(element.postText);
        this.editPostForm.controls['data'].get('title').patchValue(element.postTitle);
        this.editPostForm.controls['data'].get('postId').patchValue(element.postId);
        let type = this.sectionsTypesMappings.filter(item => item._type == element._type)[0].section;
        this.editPostForm.controls['context'].get('type').patchValue(type);
        if (type != "CAREERS" && type != "EVENTS") {
          this.editPostForm.controls['data'].get('answer').patchValue(element.postAnswer);
        }
      }
    });

    this.categoryModalReference = this.modalService.open(content, { size: 'lg' });
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
    let t = this.sectionsTypesMappings.filter(item => item._type == postObj._type)[0].section;
    let c = postObj.category;
    let id = postObj.postId;
    let title = postObj.postTitle;
    if (isPlatformBrowser(this.platformId)) {
      if (t == "BOARD") {
        let postUrl = "/posts/closed/" + id + "/" + (title != undefined ? (title.replace(/[^a-zA-Z0-9]/g, '-')) : "");
        window.open(postUrl, "_blank")
      } else {
        if (c) {
          if (title != undefined) {
            window.open("/posts/" + t.toLowerCase() + "/" + c + "/" + id + "/" + title.replace(/[^a-zA-Z0-9]/g, '-'), "_blank")
          } else {
            window.open("/posts/" + t.toLowerCase() + "/" + c + "/" + id, "_blank")
          }
        } else {
          if (title != undefined) {
            window.open("/posts/" + t + "/" + id + "/" + title.replace(/[^a-zA-Z0-9]/g, '-'), "_blank")
          } else {
            window.open("/posts/" + t + "/" + id, "_blank")
          }
        }
      }
    }
  }

  getPostDetails() {
    let paramTypeD = this.paramType.toUpperCase();
    this.service.getPostDetailsById(this.paramId, paramTypeD).subscribe((resData: any) => {
      let obj: any = resData;
      if (obj.error && obj.error.code && obj.error.code.id) {
        this.toastr.error("Failed", obj.error.code.message);
      } else {
        this.postsList = resData.posts;
        this.seo.generateTags({
          title: this.postsList[0].postTitle ? this.postsList[0].postTitle : "No post title",
          description: this.postsList[0].postText,
          slug: 'post details page'
        })

        this.userService.setTitle("Noticer | " + (this.postsList[0].postTitle ? this.postsList[0].postTitle : "No post title"));

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
      }
    }, error => {
      this.toastr.error("Failed", "Something went wrong!");
    })
  }


  redirectToOtherProfile(userId: any) {
    this.router.navigate(['profile/users/' + userId]);
  }



  getTypeFrom_Type(_type: any) {
    let t = "NA";
    let mappings = this.sectionsTypesMappings;
    let _typeArr = mappings.filter(item => item._type.toUpperCase() == _type.toUpperCase());
    if (_typeArr.length > 0) {
      t = _typeArr[0].section;
    }
    return t;
  }



  getSectionFromType(_type: any) {
    let t = "NA";
    let mappings = this.sectionsTypesMappings;
    let _typeArr = mappings.filter(item => item._type.toUpperCase() == _type.toUpperCase());
    if (_typeArr.length > 0) {
      t = _typeArr[0].name;
    }
    return t;
  }

  getModelFromTypeCategory(_type: any, category: any): string {
    let type = this.getSectionFromType(_type);
    let model = "NA"
    categories_types_models.SECTIONS.forEach(sec => {
      if (sec.title == "Topics") {
        sec.sections.forEach(ty => {
          if (ty.name.toUpperCase() == type.toUpperCase()) {
            ty.categories.forEach(ca => {
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

  goToCategoriesPage(_type: any, category: any) {
    let section = this.getTypeFrom_Type(_type);
    if (category == null) {
      this.router.navigate(['categories/' + section.toLowerCase()])
    } else {
      this.router.navigate(['categories/' + section.toLowerCase() + "/" + category])
    }
  }

  setProfilePic() {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser && this.currentUser.imageUrl) {
      this.profileImage = this.serverUrl + this.currentUser.imageUrl;
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
      window.open("http://" + link)
    }
  }


  imageFromAws(url){
    return url.indexOf("https://") != -1 ? true : false;
  }
}
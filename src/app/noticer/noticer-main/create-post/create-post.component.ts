import { isPlatformBrowser, Location } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from 'primeng/components/common/api';
import * as constant from '../../../shared/others/constants';
import { NoticerMainService } from '../noticer-main.service';
import { CustomValidator } from '../../../shared/others/custom.validator';
import { SeoService } from '../../../shared/services/seo.service';
import { ToastrService } from '../../../shared/services/Toastr.service';
import { User } from '../../../shared/models/user.model';
import { CurrentUserService } from '../../../shared/services/currentUser.service';
import { MobileDetectionService, CommonService } from '../../../shared';
import { GetPostsRequest, Pagination, Context, Data, GetCommentRequest, CommentContext, CreateCommentRequest, CreateCommentData } from '../../../shared/models/request';
import * as categories_types_models from '../../../shared/master-data/master-data'
import { Section } from '../../../shared/models/section.model';


@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  providers: [NoticerMainService, CustomValidator, ConfirmationService, SeoService, ToastrService]
})
export class CreatePostComponent implements OnInit {

  @ViewChild('sideMenuDialogDialog') sideMenuModalCotent: any;
  @ViewChild('postDialog') postDialog: ElementRef;

  @Input() isHeader: any;

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

  public questionName: any = '';
  public postsList: any = [];
  public showPostSpinner = false;

  public urls = new Array<string>();
  public getPostsRequestBody = new GetPostsRequest();

  public categoryModalReference: NgbModalRef;
  closeResult: string;

  public audienceList: any[];

  addPostForm: FormGroup;
  editPostForm: FormGroup;

  public fileSelected: File;
  public chooseFile = false;
  public postImages = [];
  public sectionsTypesMappings: any = [];
  public showMoreLink = true;
  public serverUrl;
  public categories: any = [];
  public models: any = [];
  public types: any = [];
  public states: any = [];
  public institutes: any = [];
  public currentuserId: any;
  public dateMin: Date = new Date();
  public postBtnTxt = "Post";
  ngOnInit() {
    this.seo.generateTags({
      title: 'Noticer feed | Posts and comments',
      description: 'Noticer posts and comments',
      slug: 'feed-page'
    })

    this.commonService.menuChanges.subscribe(type => {
      if (type == "updateProfilePic") {
        this.setProfilePic();
      } else if (type == "openAddPostDialog") {
        // this.postQuestionDialog(this.postDialog);
      }
    })

    this.userService.setTitle("Noticer | Posts and comments");

    this.audienceList = categories_types_models.AUDIENCE;
    this.sectionsTypesMappings = categories_types_models.SECTION_MAPPINGS;

    this.isMobile = this.mobileService.isMobile();
    this.questionName = "";
    this.initAddPostForm();

    this.models = categories_types_models.MODELS;
    this.types = categories_types_models.TYPES;

    this.route.params.subscribe(this.handleParams.bind(this));
  }

  open(){
    this.postQuestionDialog(this.postDialog);
  }

  initAddPostForm() {
    this.addPostForm = this.formbuilder.group({
      context: this.formbuilder.group({
        type: [null]
      }),
      data: this.formbuilder.group({
        _type: [null],
        _type1: [{ value: null, disabled: true }],
        postText: [null, Validators.required],
        title: [null, Validators.required],
        boardId: [null],
        text: [null],
        model: [null],
        category: [{ value: null, disabled: true }],
        images: [""],
        topic: [null],
        contacts: [null],
        website: [null],
        fromDate: [null],
        toDate: [null],
        deadline: [null],
        qualifications: [null],
        answer: [null],
        files: [null]
      }),
    });
  }

  handleParams(params: any[]) {
    if (this.router.url.indexOf('boards/closed') !== -1) {
        this.boardId = params['boardId'];
      this.prepareBoardPostReq(params['title']);
      this.paramType = "BOARD";
    } else {
        this.addPostForm.controls['data'].get('_type1').setValidators([Validators.required]);
      this.paramType = params['type'];
      this.paramCategory = params['category'];
      let sec = new Section();
      sec.section = this.paramType;
      sec.category = this.paramCategory
      if (this.paramType == undefined && this.paramCategory == undefined) {
        this.questionName = "";
      } else {
        this.selectedCategory(sec);
      }
    }
  }

  prepareBoardPostReq(boardTitle: any) {
    this.questionName = "Boards"
    // this.reqestType = "BOARD";
    // this.addPostForm.controls['data'].get('boardId').patchValue(this.boardId);
    if (boardTitle) {
      this.questionName = boardTitle
    }
  }


  postQuestionDialog(content: any) {
    if (this.currentUser) {
      this.postImages = []
      this.urls = [];
      this.resetDropdowns();
      this.addPostForm.enable();
      if (this.paramType) {
        let reqType = this.paramType.toUpperCase();
        this.reqestType = reqType;
        this.getCategoriesByType(reqType);
        let _typeArr = this.sectionsTypesMappings.filter(item => item.section == reqType);
        if (_typeArr.length > 0) {
          this.addPostForm.controls['data'].get('_type1').patchValue(reqType);
          this.addPostForm.controls['data'].get('_type').patchValue(_typeArr[0]._type);
          this.addPostForm.controls['context'].get('type').patchValue(reqType);
          if (reqType == "BOARD") {
            this.addPostForm.controls['data'].get('boardId').patchValue(this.boardId);
          }
          this.addPostForm.controls['data'].get('_type1').disable();
        } else {
          this.toastr.error("Failed", "Given type is wrong!");
        }
      }
      if (this.paramCategory && this.paramCategory != "home") {
        this.addPostForm.controls['data'].get('category').patchValue(this.paramCategory);
        this.addPostForm.controls['data'].get('category').disable();
      }
      this.categoryModalReference = this.modalService.open(content, { size: 'lg' });
      this.categoryModalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  private getDismissReason(reason: any): string {
    this.initAddPostForm();
    this.addPostForm.enable();
    this.postImages = [];
    this.urls = [];
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
      this.questionName = '';
      if (data.category == undefined || data.category == "home") {
        this.questionName = this.prepareQuestionName(data.section, null);
      } else {
        this.questionName = this.prepareQuestionName(data.section, data.category);
      }
    }
  }

  prepareQuestionName(type, category) {
    let questionName = "";
    categories_types_models.SECTIONS.forEach(sec => {
      if (sec.title == "Topics") {
        sec.sections.forEach(ty => {
          if (ty.code.toUpperCase() == type.toUpperCase()) {
            questionName = ty.name;
            if (category) {
              ty.categories.forEach(ca => {
                if (ca.code == category) {
                  questionName = questionName + " (" + ca.name + ")";
                }
              })
            }
          }
        })
      }
    });
    return questionName;
  }

  detectFiles(event) {
    let files = event.target.files;
    if (files.length > 4 || (this.urls.length + files.length) > 4) {
      this.toastr.error("Failed", "Only 4 images allowed");
    } else if (files) {
      for (let file of files) {
        let reader = new FileReader();
        let found = [];
        reader.onload = (e: any) => {
          found = this.urls.filter(item => item == e.target.result);
          if (found.length == 0) {

            this.urls.push(e.target.result);
          }
        }
        reader.readAsDataURL(file);
        if (found.length == 0) {
          this.postImages.push(file);
        }
      }
    }
  }

  getCategoriesByType(type) {
    this.categories = [];
    categories_types_models.SECTIONS.forEach(sec => {
      if (sec.title == "Topics") {
        sec.sections.forEach(ty => {
          if (ty.code.toUpperCase() == type.toUpperCase()) {
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

    this.models = [];
    categories_types_models.MODELS.forEach(item => {
      let type_search = (type == "VERBAL" || type == "QUANTS" || type == "DI") ? "VERBAL" : type;
      if (item.type == type_search) {
        this.models = item.models;
      }
    });
  }

  resetDropdowns() {
    //resetting values after type chage

    // this.addPostForm.controls['data'].get('_type1').patchValue(null);
    this.addPostForm.controls['data'].get('_type').patchValue(null);
    this.addPostForm.controls['context'].get('type').patchValue(null);

    this.addPostForm.controls['data'].get('website').patchValue(null);
    this.addPostForm.controls['data'].get('model').patchValue(null);
    this.addPostForm.controls['data'].get('category').patchValue(null);
    this.addPostForm.controls['data'].get('topic').patchValue(null);
    this.addPostForm.controls['data'].get('contacts').patchValue(null);
    this.addPostForm.controls['data'].get('fromDate').patchValue(null);
    this.addPostForm.controls['data'].get('toDate').patchValue(null);
    this.addPostForm.controls['data'].get('qualifications').patchValue(null);
  }

  removeFromImages(index) {
    this.urls.splice(index, 1);
    this.postImages.splice(index, 1);
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


  setProfilePic() {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser && this.currentUser.imageUrl) {
      this.profileImage = this.serverUrl + this.currentUser.imageUrl;
    } else {
      this.profileImage = "assets/images/noticer_default_user_img.png"
    }
  }

  createPost() {
    if (this.addPostForm.controls['data'].get('_type1').value) {
      let reqType = this.addPostForm.controls['data'].get('_type1').value;
      let _typeArr = this.sectionsTypesMappings.filter(item => item.section == reqType);
      this.addPostForm.controls['data'].get('_type').patchValue(_typeArr[0]._type);
      this.addPostForm.controls['context'].get('type').patchValue(reqType);
    }
    let postText = this.addPostForm.controls['data'].get('postText').value
    this.addPostForm.controls['data'].get('text').patchValue(postText);

    let imageUrls = [];
    if (this.postImages.length > 0) {
      this.postImages.forEach(element => {
        let formData: FormData = new FormData();
        formData.append('file', element);
        this.service.uploadImage(formData).subscribe((resData: any) => {
            if(resData && resData.error && resData.error.code){
                this.toastr.error("Failed", resData.error.code.longMessage);
            } else{
                imageUrls.push(resData.url);
          }
          if (this.postImages.length == imageUrls.length) {
            this.addPostForm.controls["data"].get("images").patchValue(imageUrls);
            this.savePost();
          }
        })
      }, error => {
        this.toastr.error("Failed", "Something went wrong!");
      })
    } else {
      this.addPostForm.controls["data"].get("images").patchValue([]);
      this.savePost()
    }
  }

  savePost() {
    if (this.addPostForm.valid) {
      if (!this.addPostForm.controls['data'].get("category").value) {
        !this.addPostForm.controls['data'].get("category").patchValue("others");
      }
      this.postBtnTxt = "Posting..."
      console.log(this.addPostForm.getRawValue());
      console.log(this.addPostForm.value);
      this.service.createPost(this.addPostForm.getRawValue()).subscribe((resData: any) => {
        if (resData && resData.code && resData.code.id) {
          this.toastr.error("Failed", resData.code.longMessage);
          this.postBtnTxt = "Post"
        } else if (resData && resData.error && resData.error.code && resData.error.code.id) {
          this.toastr.error("Failed", resData.error.code.longMessage);
          this.postBtnTxt = "Post"
        } else if (resData && resData.post) {
          this.postBtnTxt = "Post"
          let data = resData.post;
          data.maxLength = constant.showSeeMorePostTextLenth;
          data.selectComments = false;
          data.commentOffset = 0;
          data.comments = [];
          data.commentsSpinner = false;
          data.viewAnswer = false;
        //   this.postsList.splice(0, 0, data);
          this.initAddPostForm();
          this.toastr.success("Post success", "Post successfully added");
          this.noData = false;
          this.categoryModalReference.close();
        this.commonService.addPostInListofPosts(data);
          this.postImages = [];
          this.urls = [];
        } else {
          this.postBtnTxt = "Post"
          this.toastr.error("Failed", "Something went wrong!");
        }
      }, error => {
        this.postBtnTxt = "Post"
        this.toastr.error("Failed", "Something went wrong!");
      })
    } else {
      this.postBtnTxt = "Post"
      this.toastr.error("Failed", "Please fill all the details");
    }
  }

}
import { isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from 'primeng/components/common/api';
import { CommonService, MobileDetectionService } from '../../../shared';
import * as categories_types_models from '../../../shared/master-data/master-data';
import { GetPostsRequest } from '../../../shared/models/request';
import { Section } from '../../../shared/models/section.model';
import { User } from '../../../shared/models/user.model';
import * as constant from '../../../shared/others/constants';
import { CustomValidator } from '../../../shared/others/custom.validator';
import { CurrentUserService } from '../../../shared/services/currentUser.service';
import { SeoService } from '../../../shared/services/seo.service';
import { ToastrService } from '../../../shared/services/Toastr.service';
import { CoreMainService } from '../core-main.service';

import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { CreatePostDialogComponent } from './create-post-dialog/create-post-dialog.component';

@Component({
  selector: 'create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  providers: [CoreMainService, CustomValidator, ConfirmationService, SeoService, ToastrService]
})
export class CreatePostComponent implements OnInit {

  @ViewChild('sideMenuDialogDialog') sideMenuModalCotent: any;
  @ViewChild('postDialog') postDialog: ElementRef;

  @Input() isHeader: any;

  public windowStyle:any;

  public isMobile: boolean;
  public currentUser: User;
  public validUser: boolean = false;
  public noData: boolean = false;
  public boardId: any;
  public groupId: any;
  public reqestType: string;
  boardName: any;
  public dialogRef;
  
  constructor(private router: Router, private formbuilder: FormBuilder,
    private service: CoreMainService,
    private dialog: MatDialog,
    private userService: CurrentUserService,
    public mobileService: MobileDetectionService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.userService.getCurrentUser();
       if (this.currentUser && this.userService.isTokenValid()) {
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

  public urls = new Array<any>();
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
  public categories: any = [];
  public models: any = [];
  
  public states: any = [];
  public institutes: any = [];
  public currentuserId: any;
  public dateMin: Date = new Date();
  public postBtnTxt = "Post";
  public mobileFlag : boolean = false;

  public createPostDialogObject : any = {
      popupTitle : "",
      pageHeading : "",
      pageSubHeading : "",
      defaultSubHeading : "Click here to add your post",
      profileImage: "assets/images/noticer_default_user_img.png",
      selectedSection: {},
      selectedModels : [],
      types : [],
      _type:"",
      categories :[],
      _category :"",
      models :[],
      _model : "",
      requestType : "",
	  postBtnTxt : "Post",
	  boardName:"",
	  boardId: ""
  };

  ngOnInit() {
    this.seo.generateTags({
      title: 'SpurEd - Spur Encouragement to Education',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'feed-page'
    })
    this.userService.setTitle("SpurEd - Spur Encouragement to Education")

    this.commonService.menuChanges.subscribe(type => {
      if (type == "updateProfilePic") {
        this.setProfilePic();
      } else if (type == "openAddPostDialog") {
        // this.postQuestionDialog(this.postDialog);
      }
    });

    this.commonService.isMobileFlag.subscribe(mobileFlag => {
        this.mobileFlag = mobileFlag;
    });

    this.audienceList = categories_types_models.AUDIENCE;
    this.sectionsTypesMappings = categories_types_models.SECTION_MAPPINGS;

    this.isMobile = this.mobileService.isMobile();
    if(this.isMobile){
      this.windowStyle =  { size : "lg"}
    } else{
      this.windowStyle =  { size : "lg", windowClass : "myCustomModalClass"}
    }
    this.questionName = "";
    this.createPostDialogObject.pageSubHeading = this.createPostDialogObject.defaultSubHeading;
    this.initAddPostForm();

    this.models = categories_types_models.MODELS;
    this.createPostDialogObject.types = categories_types_models.TYPES;

    this.route.params.subscribe(this.handleParams.bind(this));
  }

  open() {
    this.postQuestionDialog(this.postDialog);
  }

  initAddPostForm() {
    this.addPostForm = this.formbuilder.group({
      context: this.formbuilder.group({
        section: [null]
      }),
      data: this.formbuilder.group({
        _type: [null],
        _type1: [{ value: null, disabled: true }],
        postText: [null, Validators.required],
        title: [null, Validators.required],
        boardId: [null],
        groupId: [null],
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
        files: [null],
        location:[null]
      }),
    });
  }

  handleParams(params: any[]) {
    if (this.router.url.indexOf('boards/closed') !== -1) {
      this.boardId = params['boardId'];
      this.boardName = params['title'];
      this.prepareBoardPostReq(params['title'], "board");
      this.paramType = "BOARD";
    } else if (this.router.url.indexOf('groups') !== -1) {
      this.boardId = params['groupId'];
      this.prepareBoardPostReq(params['title'], "group");
      this.paramType = "GROUP";
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

  prepareBoardPostReq(boardTitle: any, type:any) {
    this.questionName = (type === "board") ? "Boards" : "Groups";
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
      if (this.paramType && this.isHeader != "header") {
        let reqType = this.paramType.toUpperCase();
        this.reqestType = reqType;
        this.getCategoriesByType(reqType);
        let _typeArr = this.sectionsTypesMappings.filter(item => item.section == reqType);
        if (_typeArr.length > 0) {
          this.addPostForm.controls['data'].get('_type1').patchValue(reqType);
          this.createPostDialogObject._type = reqType;
          this.addPostForm.controls['data'].get('_type').patchValue(_typeArr[0]._type);
          this.addPostForm.controls['context'].get('section').patchValue(reqType);
          if (reqType == "BOARD") {
            this.addPostForm.controls['data'].get('boardId').patchValue(this.boardId);
          } else if(reqType == "GROUP"){
            this.addPostForm.controls['data'].get('groupId').patchValue(this.boardId);
          }
          this.addPostForm.controls['data'].get('_type1').disable();
        } else {
          this.toastr.error("Failed", "Given type is wrong!");
        }
      }
      if (this.paramCategory && this.paramCategory != "home") {
        this.addPostForm.controls['data'].get('category').patchValue(this.paramCategory);
        this.addPostForm.controls['data'].get('category').disable();
        this.getmodelsByCategory(this.paramCategory);
      }
      
      switch(this.reqestType){
        case "EVENTS": { 
          this.createPostDialogObject.popupTitle = "Events";
          break; 
        }

        case "NEWS": { 
          this.createPostDialogObject.popupTitle = "News";
          break; 
        } 

        case "CAREERS": { 
          this.createPostDialogObject.popupTitle = "Job";
          break; 
        } 

        default : {
            this.createPostDialogObject.popupTitle = "Question";
            break;
        }

      }

      /*this.categoryModalReference = this.modalService.open(content, this.windowStyle);
      this.categoryModalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });*/

      /* added data for new POPUP */
      this.createPostDialogObject.requestType = this.reqestType;
	  this.createPostDialogObject._type = this.reqestType;
	  this.createPostDialogObject._category = this.paramCategory;
      this.createPostDialogObject.categories = this.categories;
      this.createPostDialogObject.models = this.models;
	  this.createPostDialogObject.boardId =this.boardId;
	  this.createPostDialogObject.boardName =this.boardName;

      let dialogCreatePostConfig = new MatDialogConfig();
      const configData = {
        name: "Create Post",
        data : this.createPostDialogObject,
	  };
      dialogCreatePostConfig.data = configData;
      dialogCreatePostConfig.width = '800px';
	  dialogCreatePostConfig.autoFocus= false;
	  dialogCreatePostConfig.minHeight = 'calc(100vh - 150px)';
      dialogCreatePostConfig.height = 'auto';
	  
      this.dialogRef = this.dialog.open(CreatePostDialogComponent, dialogCreatePostConfig);
	  const sub = this.dialogRef.componentInstance.onPost.subscribe((data) => {
		  // do something
		if(data.postType === "Public"){
			this.addPostForm.controls['data'].get('_type1').patchValue(typeof data._type == "object" ? data._type.value : data._type);
			this.addPostForm.controls['data'].get('category').patchValue(typeof data._category == "object" ? data._category.value : data._category);
			this.addPostForm.controls['data'].get('model').patchValue(typeof data._model == "object" ? data._model.value : data._model);
		}
		this.addPostForm.controls['data'].get('title').patchValue(data.heading);
		this.addPostForm.controls['data'].get('postText').patchValue(data.description);
		
		if(data.selectedOption === "mcq"){
			let optionsString = "";
			Object.keys(data.multipleOption).forEach(function(key,i){
				if(key !== undefined && key.indexOf('option') !== -1 && data.multipleOption[key] !== ""){
					optionsString += (i+1)+'). '+ data.multipleOption[key] +'<br>';
			 	}
			});
		  	
			this.addPostForm.controls['data'].get('postText').patchValue(optionsString); 
		}
		this.addPostForm.controls['data'].get('answer').patchValue(data.multipleOption.answer);
 		
		if(data.selectedOption === "event"){
			this.addPostForm.controls['data'].get('fromDate').patchValue(data.event.fromDate);
			this.addPostForm.controls['data'].get('toDate').patchValue(data.event.toDate);
			this.addPostForm.controls['data'].get('contacts').patchValue(data.event.contacts);
			this.addPostForm.controls['data'].get('website').patchValue(data.event.website);
			this.addPostForm.controls['data'].get('location').patchValue(data.event.location);
		}
		this.postImages = data.postImages;
		this.createPost();
	  }); 

    } else {
      this.router.navigate(['/home']);
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
        sec.sections.forEach((ty:any) => {
          if (ty.code.toUpperCase() == type.toUpperCase()) {
            questionName = ty.name;
            this.createPostDialogObject.pageSubHeading = ty.pageSubHeading ? ty.pageSubHeading : this.createPostDialogObject.defaultSubHeading;
            if (category) {
              ty.categories.forEach((ca:any) => {
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
  
  handelMultipleFiles(e,file,found){
	  // Here you can use `e.target.result` or `this.result`
		// and `f.name`.
		found = this.urls.filter(item => function(){
				   if(item && item.preview){
						item.preview == e.target.result;
					}
		});
		//if(found.length == 0) {
		   file["preview"] = e.target.result;;
		   this.urls.push(file);
		//}
  }

  detectFiles(event) {
    let files = event.target.files;
    if (files.length > 4 || (this.urls.length + files.length) > 4) {
      this.toastr.error("Failed", "Only 4 images allowed");
    } else if (files) {
       for(var i=0 ; i< files.length; i++){
        let reader = new FileReader();
		let file = files[i];
        let found = [];
		let self = this;
		reader.onload = function (e) {
			self.handelMultipleFiles(e,file,found);
		}
       
        if(file.type === "image/gif" ||
             file.type === "image/jpeg" || 
             file.type === "image/jpg"|| 
             file.type === "image/png"){

             reader.readAsDataURL(file);
			 console.log(this.urls);
      
        }else if(file.type === "text/plain" ||
             file.type === "application/pdf"){
            
			this.urls.push(file);
        }else{
            if(file.name){
              if(file.name.indexOf('.doc') !== -1 || file.name.indexOf('.docx') !== -1){
                 file.fileType = "application/doc";
              }else if(file.name.indexOf('.ppt') !== -1 || file.name.indexOf('.pptx') !== -1){
                 file.fileType = "application/ppt";
              }else if(file.name.indexOf('.xls') !== -1 || file.name.indexOf('.xlsx') !== -1){
                 file.fileType = "application/xls";
              } 
			}
            this.urls.push(file);
        }
      
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
        sec.sections.forEach((ty:any) => {
          if (ty.code.toUpperCase() == type.toUpperCase()) {
            this.createPostDialogObject.selectedSection = ty;
            ty.categories.forEach((ca :any) => {
              if (ca.name != "Home") {
                let vo = { label: ca.name, value: ca.code };
                this.categories.push(vo);
              }
            })
          }
        })
      }
    });

    this.setModels(type);    
  }

  getmodelsByCategory(selectedCategory){
    if(this.createPostDialogObject.selectedSection!== undefined){
      if(this.createPostDialogObject.selectedSection.modelsbyCategory !== undefined && this.createPostDialogObject.selectedSection.modelsbyCategory === "true" ){
        this.createPostDialogObject.selectedSection.categories.forEach(category => {
            if (category.code == selectedCategory) {
             this.models = (category.models !== undefined) ? category.models : this.createPostDialogObject.selectedModels;
            }
          });
      }else{
          this.setModels(this.createPostDialogObject.selectedSection.code);
      }
    }
  }

  setModels(type) {
    this.models = [];
	if(type === undefined)
		return [];
    type= type.toUpperCase();
    categories_types_models.MODELS.forEach(item => {
      let type_search = (type == "VERBAL" || type == "QUANTS" || type == "DI") ? "VERBAL" : type;
      if (item.type == type_search) {
        this.models = item.models;
        this.createPostDialogObject.selectedModels = this.models;
      }
    });
  }

  resetDropdowns() {
    //resetting values after type chage

    // this.addPostForm.controls['data'].get('_type1').patchValue(null);
    this.addPostForm.controls['data'].get('_type').patchValue(null);
    this.addPostForm.controls['context'].get('section').patchValue(null);

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


  setProfilePic() {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser && this.currentUser.imageUrl) {
      this.createPostDialogObject.profileImage = this.currentUser.imageUrl;
    }  
  }

  createPost() {
    this.postBtnTxt = "Posting...";
	this.createPostDialogObject.postBtnTxt = "Posting...";
    if (this.addPostForm.controls['data'].get('_type1').value) {
      let reqType = this.addPostForm.controls['data'].get('_type1').value;
      let _typeArr = this.sectionsTypesMappings.filter(item => item.section == reqType);
      this.addPostForm.controls['data'].get('_type').patchValue(_typeArr[0]._type);
      this.addPostForm.controls['context'].get('section').patchValue(reqType);
    }
    let postText = this.addPostForm.controls['data'].get('postText').value.trim()
    this.addPostForm.controls['data'].get('text').patchValue(postText);

    let postTitle = this.addPostForm.controls['data'].get('title').value.trim()
    this.addPostForm.controls['data'].get('title').patchValue(postTitle);

    if(this.addPostForm.controls['data'].get('answer').value){
      let postAns = this.addPostForm.controls['data'].get('answer').value.trim()
      this.addPostForm.controls['data'].get('answer').patchValue(postAns);
    }

    let imageUrls = [];
    let fileUrls = [];
    if (this.postImages.length > 0) {
      this.postImages.forEach(element => {
        let formData: FormData = new FormData();
        formData.append('file', element);

        this.service.upload(formData,element).subscribe((resData: any) => {
          if (resData && resData.error && resData.error.code) {
            this.toastr.error("Failed", resData.error.code.longMessage);
            this.postBtnTxt = "Post";
			this.createPostDialogObject.postBtnTxt = "Post";
          } else {
            if(element.type === "image/gif" || element.type === "image/jpeg" || 
              element.type === "image/jpg" ||  element.type === "image/png"){
              imageUrls.push(resData.url);
            }else{
              fileUrls.push(resData.url);
            }
          }
          if (this.postImages.length == (imageUrls.length + fileUrls.length) ) {
            this.addPostForm.controls["data"].get("images").patchValue(imageUrls);
            this.addPostForm.controls["data"].get("files").patchValue(fileUrls);
            this.savePost();
          }
        })
      }, error => {
        this.toastr.error("Failed", "Something went wrong!");
        this.postBtnTxt = "Post";
		this.createPostDialogObject.postBtnTxt = "Post";
      })
    } else {
      this.addPostForm.controls["data"].get("images").patchValue([]);
      this.savePost()
    }
  }

  savePost() {
    if (this.addPostForm.valid) {
      if (!this.addPostForm.controls['data'].get("category").value) {
        // this.addPostForm.controls['data'].get("category").patchValue("others");
      }
      console.log(this.addPostForm.getRawValue());
      console.log(this.addPostForm.value);
      this.service.createPost(this.addPostForm.getRawValue()).subscribe((resData: any) => {
        if (resData && resData.code && resData.code.id) {
          this.toastr.error("Failed", resData.code.longMessage);
          this.postBtnTxt = "Post";
		  this.createPostDialogObject.postBtnTxt = "Post";
        } else if (resData && resData.error && resData.error.code && resData.error.code.id) {
          this.toastr.error("Failed", resData.error.code.longMessage);
          this.postBtnTxt = "Post";
		  this.createPostDialogObject.postBtnTxt = "Post";
        } else if (resData && resData.post) {
          if (this.router.url.indexOf('categories') !== -1 || this.router.url.indexOf('feed') !== -1 
          || this.router.url.indexOf('boards/closed') !== -1 || this.router.url.indexOf('groups') !== -1) {

          } else{
            let _t:string = this.addPostForm.controls['context'].get("type").value
            let c = this.addPostForm.controls['data'].get("category").value;
            let url = "categories/"+ _t.toLowerCase();
            if(c){
              url = url + "/" + c;
            }
            this.router.navigate([url]);
          }
          this.postBtnTxt = "Post";
		  this.createPostDialogObject.postBtnTxt = "Post";
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
		  if(this.categoryModalReference)
			this.categoryModalReference.close();
          this.commonService.addPostInListofPosts(data);
          this.postImages = [];
          this.urls = [];
		  if(this.dialogRef)
			this.dialogRef.close();
        } else {
          this.postBtnTxt = "Post";
		  this.createPostDialogObject.postBtnTxt = "Post";
          this.toastr.error("Failed", "Something went wrong!");
        }
      }, error => {
        this.postBtnTxt = "Post";
		this.createPostDialogObject.postBtnTxt = "Post";
        this.toastr.error("Failed", "Something went wrong!");
      })
    } else {
      this.postBtnTxt = "Post";
	  this.createPostDialogObject.postBtnTxt = "Post";
      this.toastr.error("Failed", "Please fill all the details");
    }
  }

  imageFromAws(url){
    return url.indexOf("https://") != -1 ? true : false;
  }

}
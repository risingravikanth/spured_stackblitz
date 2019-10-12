import { Component, ElementRef, OnInit, Inject, ViewChild, PLATFORM_ID } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/components/common/messageservice';
import { MobileDetectionService } from '../../../shared';
import { Section } from '../../../shared/models/section.model';
import { User } from '../../../shared/models/user.model';
import { CustomValidator } from '../../../shared/others/custom.validator';
import { CommonService } from '../../../shared/services/common.service';
import { CurrentUserService } from '../../../shared/services/currentUser.service';
import { SECTIONS } from './../../../shared/master-data/master-data';
import { ToastrService } from '../../../shared/services/Toastr.service';
import { AdminGroupService } from '../../admin/admin-group/admin-group.service';
import { LeftMenuService } from './left-menu.service';


const CLOSEDBOARDS_KEY = makeStateKey<string>('closedboards');

@Component({
  selector: 'left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
  providers: [CustomValidator, MessageService, MobileDetectionService, LeftMenuService, CurrentUserService, ToastrService, AdminGroupService],
  // animations: [routerTransition()]
})
export class LeftMenuComponent implements OnInit {
  noBoards: boolean = true;
  showPostSpinner: boolean = false;
  showPostSpinnerGroups: boolean = false;
  boardId: any;
  groupId : any;
  paramType: any;
  paramCategory: any;
  windowStyle: any;
  noGroups: boolean;
  noPubGroups: boolean = true;
  showPostSpinnerPubGroups: boolean;
  allPublicGroups: any = [];
  publicGroupsresults: any;


  constructor(private router: Router, private formbuilder: FormBuilder,
    private commonService: CommonService,
    private modalService: NgbModal,
    private mobileService: MobileDetectionService,
    private service: LeftMenuService,
    private userService: CurrentUserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private trasferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    private adminGroupService: AdminGroupService) {

    this.isServer = isPlatformServer(this.platformId);

  }

  @ViewChild('myTopnav') el: ElementRef;

  public menuList: any = [];
  public boardsList: any = [];
  public groupsList: any = [];
  public pubGroupsList: any = [];
  public isClassVisible = false;
  public isPosFix = true;
  public varShowSectionSettings = true;
  public varShowSectionOptions = false;
  public questionName: any = '';
  public selected: any;
  public showConfig: boolean = false;

  closeResult: string;
  public sectionModalReference: NgbModalRef;
  public categoryModalReference: NgbModalRef;
  public groupModalReference: NgbModalRef;
  public isMobile: boolean;
  public isServer: boolean;
  public listOfStates: any = [];
  public listOfInstitutes: any = [];
  public listOfDepartments: any = [];
  public listOfBoards: any = [];
  addBoardForm: FormGroup;
  addPublicGroupForm: FormGroup;
  currentUser: User;
  isLoggedInUser: boolean;
  public validUser: boolean = false;
  public pendingBoardsInfo: any = [];
  public boardRequestBtnTxt = "Join Request"
  public tabTitle = "Join a Board";
  public underMaintenace: boolean = true;


  ngOnInit() {
    this.isMobile = this.mobileService.isMobile();


    if (this.isMobile) {
      this.windowStyle = { size: "lg" }
    } else {
      this.windowStyle = { windowClass: "myCustomModalClass" }
    }
    this.commonService.isMobileFlag.next(this.isMobile);
    this.initForm();

    this.isLoggedInUser = this.userService.checkLoggedInUser();
    if (this.isLoggedInUser) {
      this.validUser = true;
      this.getBoardsList();
      this.getGroups();
      this.getPubGroups();
    }

    this.menuList = SECTIONS;
    let current_url  :any = this.router.url;
    let current_menu = "";
    if(current_url && current_url.indexOf('categories') !== -1){
      current_url = current_url.split("/");
      current_menu = current_url[current_url.length-2];
    }

    if( this.menuList &&  this.menuList.length){
      for(let i=0; i< this.menuList.length ; i++){
        let menu = this.menuList[i];
        if(menu.sections && menu.sections.length){
           for(let j=0; j< menu.sections.length; j++){
            let section = menu.sections[j];
            if(current_menu === section.code){
              section["isOpened"] = false;
            }else{
              section["isOpened"] = false;
            }
           }
        }
      }
    }

    this.route.params.subscribe(this.handleParams.bind(this));

  }

  initForm() {
    this.addBoardForm = this.formbuilder.group(
      {
        requestType: [null],
        stateId: [null, Validators.required],
        instId: [null, Validators.required],
        instName: [null],
        instAddr: [null],
        deptId: [null, Validators.required],
        deptName: [null],
        startYear: [null],
        endYear: [],
        boardId: [null, Validators.required],
        comments: [null]
      }
    )
    this.addPublicGroupForm = this.formbuilder.group(
      {
        groupId: [null, Validators.required]
      }
    )
  }


  handleParams(params: any[]) {
    if (this.router.url.indexOf('boards/closed') !== -1) {
      this.boardId = params['boardId'];
      this.selectedItem = "BOARD_" + this.boardId;
    } else if(this.router.url.indexOf('groups') !== -1){
      this.groupId = params["groupId"];
      this.selectedItem = "GROUP_" + this.groupId;
    }else {
      this.paramType = params['type'];
      this.paramCategory = params['category'];
      this.selected = this.paramType;
      if (this.paramType && (this.paramCategory == undefined || this.paramCategory == "HOME")) {
        this.selectedItem = this.paramType + "HOME"
      } else {
        this.selectedItem = this.paramType + this.paramCategory;
      }
    }
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

  cacelSectionSettings() {
    this.varShowSectionSettings = true;
    this.varShowSectionOptions = false;
  }

  showSectionSettingsM() {
    this.varShowSectionSettings = false;
    this.varShowSectionOptions = true;
  }


  showAddBoardDialog(content: any, type: string) {
    this.commonService.updateHeaderMenu("sideMenuClose");
    if (type == "addBoard") {
      this.getAllSates();
      this.getUserPendingOrRejectedRequests();
    }
    this.categoryModalReference = this.modalService.open(content, this.windowStyle);
    this.categoryModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  showAddGroupDialog(content: any) {
    this.commonService.updateHeaderMenu("sideMenuClose");
    this.service.getAllAvailablePublicGroups().subscribe(
      (resData:any) => {
        this.allPublicGroups = [];
        if(resData && resData.groups && resData.groups.length > 0){
          this.publicGroupsresults = resData.groups;
          let finalPGroups = [];
          this.publicGroupsresults.forEach(element => {
            let arr = this.pubGroupsList.filter(item => item.id == element.id);
            if(arr.length == 0){
              finalPGroups.push(element);
            }
          });
          finalPGroups.forEach(item => {
            let vo = { label: item.name, value: item.id };
            this.allPublicGroups.push(vo);
          })
        }
      }
    )
    this.groupModalReference = this.modalService.open(content, this.windowStyle);
    this.groupModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  showAddSectionDialog(content: any) {
    this.sectionModalReference = this.modalService.open(content, this.windowStyle);
    this.sectionModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public selectedItem;
  selectedCategory(sec: any, cat: any) {
    this.commonService.updateHeaderMenu("sideMenuClose");
    let data = new Section();
    data.section = sec;
    data.category = cat;
    if (cat == "HOME") {
      this.selectedItem = sec + "HOME"
    } else {
      this.selectedItem = sec + cat;
    }
  }

  selectedBoard(boardId: any, boardName: any) {
    this.commonService.updateHeaderMenu("sideMenuClose");
    this.selectedItem = "BOARD_" + boardId;
    this.router.navigate(['/boards/closed/' + boardId + "/" + boardName
      // .replace(/[^a-zA-Z0-9]/g, '-')
    ])
  }
  selectedGroup(id: any, name: any) {
    this.commonService.updateHeaderMenu("sideMenuClose");
    this.router.navigate(['/groups/' + id + "/" + name
    ])
    this.selectedItem = "GROUP_" + id;
  }
  selectedPublicGroup(id: any, name: any) {
    this.commonService.updateHeaderMenu("sideMenuClose");
    this.router.navigate(['/groups/' + id + "/" + name
    ])
    this.selectedItem = "PUBLIC_GROUP_" + id;
  }

  select(section,event) {
    let itemName :any = section.code;
    this.selected = (this.selected === itemName ? null : itemName);
    section.isOpened = !section.isOpened;
     /*COMMENTED :: we don't need scroll top when ever user selected on left panel 
    */

    //window.scrollTo(0, 0);
    event.preventDefault();
  }
  isActive(item) {
     return this.selected === item;
  }

  getAllSates() {
    this.service.getAllStates().subscribe(
      resData => {
        for (var key in resData) {
          var obj = {
            value: key,
            label: resData[key]
          };
          this.listOfStates.push(obj);
        }
      }
    )
  }
  getInstitutesByState(stateCode: any) {
    this.service.getInstByState(stateCode).subscribe(
      resData => {
        this.resetDropdown('state');
        for (var i in resData) {
          let item = resData[i];
          let id = item['instId'];
          let name = item['instName'];
          var obj = {
            value: id,
            label: name
          };
          this.listOfInstitutes.push(obj);
        }
      }
    )
  }
  getDepartmentsByInstId(instId: any) {
    this.service.getDepartmentsByInst(instId).subscribe(
      resData => {
        this.resetDropdown('institute');
        for (var i in resData) {
          let item = resData[i];
          let id = item['deptId'];
          let name = item['deptName'];
          var obj = {
            value: id,
            label: name
          };
          this.listOfDepartments.push(obj);
        }
      }
    )
  }
  getBoardsByDepartment(deptId: any) {
    let instId = this.addBoardForm.controls['instId'].value;
    this.service.getBoardsByInstidDeptId(instId, deptId).subscribe(
      resData => {
        this.resetDropdown('department');
        for (var i in resData) {
          let item = resData[i];
          let id = item['boardId'];
          let name = item['boardName'];
          var obj = {
            value: id,
            label: name
          };
          this.listOfBoards.push(obj);
        }
      }
    )
  }

  getBoardsList() {
    this.showPostSpinner = true;

    /* server side rendring */


    if (this.trasferState.hasKey(CLOSEDBOARDS_KEY)) {
      // console.log("browser : getting CLOSEDBOARDS_KEY for posts");
      this.boardsList = this.trasferState.get(CLOSEDBOARDS_KEY, '');
      this.trasferState.remove(CLOSEDBOARDS_KEY);
      if (this.boardsList && this.boardsList.length > 0) {
        this.noBoards = false;
      } else {
        this.noBoards = true;
      }

      this.showPostSpinner = false;


    } else if (this.isServer) {

      // console.log("server : making service call & setting CLOSEDBOARDS_KEY");

      this.service.getUserClosedBoards().subscribe((resData: any) => {
        this.showPostSpinner = false;
        if (resData.boards) {
          this.boardsList = resData.boards;
          this.trasferState.set(CLOSEDBOARDS_KEY, this.boardsList);
          if (this.boardsList && this.boardsList.length > 0) {
            this.noBoards = false;
          } else {
            this.noBoards = true;
          }
        } else {
          this.noBoards = true;
          this.trasferState.set(CLOSEDBOARDS_KEY, []);
        }
      }, (err: any) => {
        // Do stuff whith your error
        if (err.status === 0) {
          this.showPostSpinner = false;
          this.underMaintenace = false;
        }
      });

    } else {
      // console.log("no result received : making service call CLOSEDBOARDS_KEY");

      this.service.getUserClosedBoards().subscribe((resData: any) => {
        this.showPostSpinner = false;
        if (resData.boards) {
          this.boardsList = resData.boards;
          if (this.boardsList && this.boardsList.length > 0) {
            this.noBoards = false;
          } else {
            this.noBoards = true;
          }
        } else {
          this.noBoards = true;
        }

      }, (err: any) => {
        // Do stuff whith your error
        if (err.status === 0) {
          this.showPostSpinner = false;
          this.underMaintenace = false;
        }
      });

    }

  }


  joinRequest() {
    let url;
    let body;
    if (this.addBoardForm.controls['requestType'].value == null) {
      url = "/closedboards/requesttoaddclosedboards";
      body = this.addBoardForm.controls['boardId'].value;
    } else {
      url = "/request/add/inst-dept-board";
      this.addBoardForm.controls['boardId'].patchValue(null);
      body = this.addBoardForm.value;
    }
    this.service.addBoardRequest(url, body).subscribe(resData => {
      let obj: any = resData;
      if (obj.statusCode == "ERROR") {
        this.toastr.error("Failed", obj.info);
      } else {
        this.toastr.success("Success", obj.info);
        this.showConfig = false;
        this.categoryModalReference.close();
      }
    })
  }

  getUserPendingOrRejectedRequests() {
    this.service.getPendingBoardsInfo().subscribe(
      (resData: any) => {
        if (resData && resData.requests) {
          this.pendingBoardsInfo = resData.requests;
        }
      }
    )
  }

  resetDropdown(type: any) {
    switch (type) {
      case "state":
        this.addBoardForm.controls['instId'].patchValue(null);
        this.listOfInstitutes = [];
      case "institute":
        this.addBoardForm.controls['deptId'].patchValue(null);
        this.listOfDepartments = [];
      case "department":
        this.addBoardForm.controls['boardId'].patchValue(null);
        this.listOfBoards = [];
    }
  }


  public noBordCheck = false;
  public noInstCheck = false;
  public noDeptCheck = false;

  public showDept = true;
  public showBoard = true;
  public showInst = true;

  requestCheckBox(e, type) {
    this.enableTextFileds(e, type);
    let typeCheck = e.target.checked;
    switch (type) {
      case 'INSTITUTE':
        if (typeCheck) {
          this.addBoardForm.controls['instName'].setValidators(Validators.required);
          this.addBoardForm.controls['instAddr'].setValidators(Validators.required);
          this.addBoardForm.controls['instId'].clearValidators()
          this.addBoardForm.controls['instId'].patchValue(null);
          this.boardRequestBtnTxt = "New Board Request"
          this.tabTitle = "Request New Board";
        } else {
          this.addBoardForm.controls['instName'].clearValidators();
          this.addBoardForm.controls['instAddr'].clearValidators();
          this.addBoardForm.controls['instName'].patchValue(null);
          this.addBoardForm.controls['instAddr'].patchValue(null);
          this.addBoardForm.controls['instId'].setValidators(Validators.required);
          this.boardRequestBtnTxt = "Join Request"
          this.tabTitle = "Join a Board";
        }
      case 'DEPARTMENT':
        if (typeCheck) {
          this.noDeptCheck = e.target.checked;
          this.addBoardForm.controls['deptId'].clearValidators()
          this.addBoardForm.controls['deptId'].patchValue(null);
          this.addBoardForm.controls['deptName'].setValidators(Validators.required);
          this.boardRequestBtnTxt = "New Board Request"
          this.tabTitle = "Request New Board";
        } else {
          this.addBoardForm.controls['deptId'].setValidators(Validators.required);
          this.addBoardForm.controls['deptName'].clearValidators();
          this.addBoardForm.controls['deptName'].patchValue(null);
          this.boardRequestBtnTxt = "Join Request"
          this.tabTitle = "Join a Board";
        }
      case 'BOARD':

        if (typeCheck) {
          this.noBordCheck = e.target.checked;
          this.addBoardForm.controls['boardId'].clearValidators()
          this.addBoardForm.controls['boardId'].patchValue(null);
          this.addBoardForm.controls['startYear'].setValidators(Validators.required);
          this.addBoardForm.controls['endYear'].setValidators(Validators.required);
          this.boardRequestBtnTxt = "New Board Request"
          this.tabTitle = "Request New Board";
        }
        else {
          this.addBoardForm.controls['startYear'].clearValidators();
          this.addBoardForm.controls['endYear'].clearValidators();
          this.addBoardForm.controls['startYear'].patchValue(null)
          this.addBoardForm.controls['endYear'].patchValue(null);
          this.addBoardForm.controls['boardId'].setValidators(Validators.required);
          this.boardRequestBtnTxt = "Join Request"
          this.tabTitle = "Join a Board";
        }
    }
    this.addBoardForm.updateValueAndValidity();
  }


  enableTextFileds(e, type) {
    let checkType: boolean = e.target.checked;
    if (checkType) {
      this.addBoardForm.controls['requestType'].patchValue(type);
      this.addBoardForm.controls['comments'].setValidators(Validators.required)
    } else {
      this.addBoardForm.controls['comments'].clearValidators();
      this.addBoardForm.controls['comments'].patchValue(null);
      this.addBoardForm.controls['requestType'].patchValue(null);
    }
    this.addBoardForm.updateValueAndValidity();
    if (type == "INSTITUTE") {
      if (checkType) {
        this.showDept = false;
        this.showBoard = false;
      } else {
        this.showDept = true;
        this.showBoard = true;
        this.noDeptCheck = false
        this.noBordCheck = false;
      }

    } else if (type == "DEPARTMENT") {
      if (checkType) {
        this.showInst = false;
        this.showBoard = false;
      } else {
        this.showInst = true;
        this.showBoard = true;
        this.noBordCheck = false;
      }

    } else if (type == "BOARD") {
      if (checkType) {
        this.showInst = false;
        this.showDept = false;
      } else {
        this.showInst = true;
        this.showDept = true;
      }
    }
  }

  getGroups() {
    this.showPostSpinnerGroups = true;
    this.adminGroupService.getMyGroups().subscribe((resData: any) => {
      this.showPostSpinnerGroups = false;
      if (resData.groups) {
        this.groupsList = resData.groups;
        this.noGroups = false;
      } else {
        this.noGroups = true;
      }
    })
  }
  getPubGroups() {
    this.showPostSpinnerPubGroups = true;
    this.adminGroupService.getPublicGroups().subscribe((resData: any) => {
      this.showPostSpinnerPubGroups = false;
      if (resData.groups) {
        this.pubGroupsList = resData.groups;
        this.noPubGroups = false;
      } else {
        this.noPubGroups = true;
      }
    })
  }

  joinInPublicGroup(){
    console.log(this.addPublicGroupForm.value);
    if(this.addPublicGroupForm.valid){
      let arr = this.publicGroupsresults.filter(item => item.id = this.addPublicGroupForm.controls['groupId'].value);
      if(arr.length > 0){
        this.service.joinInPublicGroup(arr[0]).subscribe((resData:any) => {
          if(resData && resData.error && resData.error.code){
            this.toastr.error("Failed", resData.error.longMessage);
          } else if(resData && resData.groups && resData.groups[0].id){
            this.toastr.success("Success", "Successfully joined in group");
            if (this.isLoggedInUser) {
              this.getPubGroups();
              this.addPublicGroupForm.reset();
              this.groupModalReference.close();
            }
          } else{
            this.toastr.error("Failed", "Something went wrong");
          }

        })
      }
    } else{
      alert("Please select group");
    }
  }

}

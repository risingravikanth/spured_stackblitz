import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { SideMenuService } from './side-menu.service';
import { ToastrService } from '../../../shared/services/Toastr.service';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  providers: [CustomValidator, MessageService, MobileDetectionService, SideMenuService, CurrentUserService, ToastrService],
  // animations: [routerTransition()]
})
export class SideMenuComponent implements OnInit {
  noBoards: boolean = true;
  showPostSpinner: boolean = false;
  boardId: any;
  paramType: any;
  paramCategory: any;

  constructor(private router: Router, private formbuilder: FormBuilder,
    private commonService: CommonService,
    private modalService: NgbModal,
    private mobileService: MobileDetectionService,
    private service: SideMenuService,
    private userService: CurrentUserService,
    private toastr: ToastrService,
    private route: ActivatedRoute, ) { }

  @ViewChild('myTopnav') el: ElementRef;

  public menuList: any = [];
  public boardsList: any = [];
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
  public isMobile: boolean;
  public listOfStates: any = [];
  public listOfInstitutes: any = [];
  public listOfDepartments: any = [];
  public listOfBoards: any = [];
  addBoardForm: FormGroup;
  currentUser: User;
  public validUser: boolean = false;
  public pendingBoardsInfo: any = [];
  ngOnInit() {
    this.isMobile = this.mobileService.isMobile();
    this.commonService.isMobileFlag.next(this.isMobile);
    this.initForm();
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.validUser = true;
    }

    this.menuList = SECTIONS;

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
    this.getBoardsList();
  }


  handleParams(params: any[]) {
    if (this.router.url.indexOf('boards/closed') !== -1) {
      this.boardId = params['boardId'];
      this.selectedItem = "BOARD_" + this.boardId;
    } else {
      this.paramType = params['type'];
      this.paramCategory = params['category'];
      this.selected = this.paramType;
      if(this.paramType && (this.paramCategory == undefined || this.paramCategory == "HOME")){
        this.selectedItem = this.paramType+"HOME"
      } else{
        this.selectedItem = this.paramType+this.paramCategory;
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


  showAddBoardDialog(content: any) {
    this.commonService.updateHeaderMenu("sideMenuClose");
    this.getAllSates();
    this.getUserPendingOrRejectedRequests();
    this.categoryModalReference = this.modalService.open(content, { size: 'lg' });
    this.categoryModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  showAddSectionDialog(content: any) {
    this.sectionModalReference = this.modalService.open(content);
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

  select(item) {
    this.selected = (this.selected === item ? null : item);
    window.scrollTo(0, 0);
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
    this.service.getUserClosedBoards().subscribe((resData: any) => {
      this.showPostSpinner = false;
      if (resData.boards) {
        if(resData.boards){
          this.boardsList = resData.boards;
          if (this.boardsList && this.boardsList.length > 0) {
            this.noBoards = false;
          } else {
            this.noBoards = true;
          }
        } else{
          this.noBoards = true;
        }
      }
    })
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
        } else {
          this.addBoardForm.controls['instName'].clearValidators();
          this.addBoardForm.controls['instAddr'].clearValidators();
          this.addBoardForm.controls['instName'].patchValue(null);
          this.addBoardForm.controls['instAddr'].patchValue(null);
          this.addBoardForm.controls['instId'].setValidators(Validators.required);
        }
      case 'DEPARTMENT':
        if (typeCheck) {
          this.noDeptCheck = e.target.checked;
          this.addBoardForm.controls['deptId'].clearValidators()
          this.addBoardForm.controls['deptId'].patchValue(null);
          this.addBoardForm.controls['deptName'].setValidators(Validators.required);
        } else {
          this.addBoardForm.controls['deptId'].setValidators(Validators.required);
          this.addBoardForm.controls['deptName'].clearValidators();
          this.addBoardForm.controls['deptName'].patchValue(null);
        }
      case 'BOARD':

        if (typeCheck) {
          this.noBordCheck = e.target.checked;
          this.addBoardForm.controls['boardId'].clearValidators()
          this.addBoardForm.controls['boardId'].patchValue(null);
          this.addBoardForm.controls['startYear'].setValidators(Validators.required);
          this.addBoardForm.controls['endYear'].setValidators(Validators.required);
        }
        else {
          this.addBoardForm.controls['startYear'].clearValidators();
          this.addBoardForm.controls['endYear'].clearValidators();
          this.addBoardForm.controls['startYear'].patchValue(null)
          this.addBoardForm.controls['endYear'].patchValue(null);
          this.addBoardForm.controls['boardId'].setValidators(Validators.required);

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

}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/components/common/messageservice';
import { SideMenuService } from '../../../../noticer/noticer-main/side-menu/side-menu.service';
import { SECTIONS } from '../../../master-data/master-data';
import { Section } from '../../../models/section.model';
import { User } from '../../../models/user.model';
import { CustomValidator } from '../../../others/custom.validator';
import { CommonService } from '../../../services/common.service';
import { CurrentUserService } from '../../../services/currentUser.service';
import { MobileDetectionService } from '../../../services';

@Component({
  selector: 'side-menu-mobile',
  templateUrl: './side-menu-mobile.component.html',
  styleUrls: ['./side-menu-mobile.component.css'],
  providers: [CustomValidator, MessageService, MobileDetectionService, SideMenuService, CurrentUserService]
})
export class SideMenuMobileComponent implements OnInit {
  noBoards: boolean = false;
  showPostSpinner:boolean = false;

  constructor(private router: Router, private formbuilder: FormBuilder,
    private commonService: CommonService,
    private modalService: NgbModal,
    private mobileService: MobileDetectionService,
    private service: SideMenuService,
    private userService: CurrentUserService) { }

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
  ngOnInit() {
    this.isMobile = this.mobileService.isMobile();
    this.initForm();
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.validUser = true;
    }

    this.menuList = SECTIONS;

  }

  initForm() {
    this.addBoardForm = this.formbuilder.group(
      {
        stateId: [null, Validators.required],
        instId: [null, Validators.required],
        deptId: [null, Validators.required],
        boardId: [null, Validators.required]
      }
    )
    this.getBoardsList();
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


  showAddCategoryDialog(content: any) {
    this.commonService.updateHeaderMenu("sideMenuClose");
    this.getAllSates();
    this.categoryModalReference = this.modalService.open(content);
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
    this.router.navigate(['/boards/closed/'+boardId+"/"+boardName]);
    this.selectedItem = boardId + boardName;
  }

  select(item) {
    this.selected = (this.selected === item ? null : item);
    window.scrollTo(0,0);
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
      this.boardsList = resData;
      this.showPostSpinner = false;
      if(this.boardsList && this.boardsList.length > 0){
        this.noBoards = false;
      } else{
        this.noBoards = true;
      }
    })
  }


  joinRequest(boardId: any) {
    this.service.addBoardRequest(boardId).subscribe(resData => {
      let obj: any = resData;
      if (obj.statusCode == "ERROR") {
        alert(obj.info);
      } else {
        alert(obj.info);
        console.log(resData);
        this.showConfig = false;
        this.categoryModalReference.close();
      }
    })
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

}

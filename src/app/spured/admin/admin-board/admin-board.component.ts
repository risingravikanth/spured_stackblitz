import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/debounceTime';
import { MobileDetectionService } from '../../../shared';
import { CurrentUserService } from '../../../shared/services/currentUser.service';
import { ToastrService } from '../../../shared/services/Toastr.service';
import { LeftMenuService } from '../../core-main/left-menu/left-menu.service';
import { AdminBoardService } from './admin-board.service';

@Component({
  selector: 'admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.css'],
  providers: [MobileDetectionService, CurrentUserService, LeftMenuService, AdminBoardService, ToastrService]
})
export class AdminBoardComponent implements OnInit {

  public boardResponse: any;

  public listOfBoards: any = [];
  public listOfBoardsResponse: any = [];
  public listOfDepartments: any = [];
  public peopleInBoards: any = [];
  public isMobile: boolean;
  public currentUser: any;
  public boardId: any;
  showPeople: boolean = false;
  validAddUsers: boolean = false;
  validRemoveUsers: boolean = false;
  public usersForm: FormGroup;
  public addBoardForm: FormGroup;
  public editBoardForm: FormGroup;
  boardName: any;
  boardDisplayName :any;
  deptName: any;
  instName: any;
  startYear: any;
  endYear: any;
  updateBoardTitle :any = false;
  public boardModalReference: NgbModalRef;
  closeResult: string;
  windowStyle: any;
  addBoardBtnTxt: string = "Create";
  institute: any;
  showAdminPeople: boolean;
  adminsInBoards: any = [];
  validAddAdmins: boolean;
  showPanels :any = false;
  
  @Input()
  set fromChild(value: any) {
    if (value) {
      this.institute = value
      this.addBoardForm.get("instId").patchValue(this.institute.instId);
    }
  }

  @Input()
  set fromChildDepts(value: any) {
    if (value) {
      this.listOfDepartments = value
    }
  }

  constructor(private fb: FormBuilder, private mobileService: MobileDetectionService, private userService: CurrentUserService,
    private leftMenuService: LeftMenuService, private service: AdminBoardService, private toastr: ToastrService,
    private modalService: NgbModal) {

  }

  ngOnInit() {
    this.usersForm = this.fb.group({
      addPeopleList: [""],
      removePeopleList: [""],
      addAdminsList: [""]
    })
    this.addBoardForm = this.fb.group({
      instId: [null, Validators.required],
      deptId: [null, Validators.required],
      startYear: [null, Validators.required],
      endYear: [null, Validators.required]
    })
    this.editBoardForm = this.fb.group({
      boardId: [null, Validators.required],
      boardTitle: [null, Validators.required]
    })
    this.isMobile = this.mobileService.isMobile();
    if (this.isMobile) {
      this.windowStyle = { size: "lg" }
    } else {
      this.windowStyle = { windowClass: "myCustomModalClass" }
    }
    this.currentUser = this.userService.getCurrentUser();
    this.getAdminClosedBoards();
    this.usersForm.controls['addPeopleList'].valueChanges
      .debounceTime(1000)
      .subscribe(newValue => this.checkEmails(newValue, "add"));
    this.usersForm.controls['removePeopleList'].valueChanges
      .debounceTime(1000)
      .subscribe(newValue => this.checkEmails(newValue, "remove"));
    this.usersForm.controls['addAdminsList'].valueChanges
      .debounceTime(1000)
      .subscribe(newValue => this.checkEmails(newValue, "addAdmin"));
  }

  getAdminClosedBoards() {
    this.leftMenuService.getAdminClosedBoards().subscribe(resData => {
      if (resData.boards) {
        this.listOfBoardsResponse = resData.boards;
        this.listOfBoards.length =0; 
        for (var i in resData.boards) {
          let item = resData.boards[i];
          let id = item['boardId'];
          let name = item['boardName'] + ' (' + item['boardTitle'] +')';
          var obj = {
            value: id,
            label: name
          };
          this.listOfBoards.push(obj);
        }
      }
    });
  }

  getUsersInClosedBoard(boardId: any) {
    // this.boardName = this.listOfBoards.filter(item => item.value == boardId)[0].label;
	this.showPanels = false;
    let array = this.listOfBoardsResponse.filter(item => item.boardId == boardId);
    if (array.length > 0) {
      this.deptName = this.getDepartmentName(array[0].deptName, array[0].deptId);
      this.startYear = array[0].startYear;
      this.endYear = array[0].endYear;
      this.editBoardForm.controls['boardId'].patchValue(array[0].boardId);
      this.editBoardForm.controls['boardTitle'].patchValue(array[0].boardTitle);
      this.boardName = array[0].boardName;
      this.boardDisplayName = array[0].boardTitle;
	  this.showPanels = true;
    }


    // let ar = this.boardName.split(" ");
    // if (ar.length >= 3) {
    //   this.deptName = ar[1];
    //   this.startYear = ar[2].split("-")[0];
    //   this.endYear = ar[2].split("-")[1];
    // }
    this.service.getUsersInClosedBoard(boardId).subscribe(
      resData => {
        this.peopleInBoards = resData;
        this.usersForm.get("addPeopleList").patchValue("");
        this.usersForm.get("removePeopleList").patchValue("");
        if (this.peopleInBoards && this.peopleInBoards.length > 0) {
          this.showPeople = true;
        } else {
          this.showPeople = false;
        }
      }
    )

    this.service.getAdminsInClosedBoard(boardId).subscribe(
      (resData:any) => {
        if(resData && resData.admins){
          this.adminsInBoards = resData.admins;
          console.log(this.adminsInBoards)
          if (this.adminsInBoards && this.adminsInBoards.length > 0) {
            this.showAdminPeople = true;
          } else {
            this.showAdminPeople = false;
          }
        }
      }
    )
  }

  editBoard(){
    this.service.editBoard(this.editBoardForm.value).subscribe(
      (resData:any) => {
        if(resData && resData.boardId){
          this.getAdminClosedBoards();
          this.updateBoardTitle = false;
          this.boardDisplayName = resData.boardTitle;
          this.toastr.success("Success", "Board Title Update Successfully.");
        } else{
          this.toastr.error("Failed", "Something went wrong!");
        }
      }
    )
  }

  getDepartmentName(deptName, deptId) {
    if (deptName) {
      return deptName;
    } else {
      switch (deptId) {
        case 1:
          return 'Computers';
        case 2:
          return 'Electronics';
        case 3:
          return 'Mechanical';
        case 4:
          return 'Chemical';
        case 5:
          return 'Electrical';
        case 6:
          return 'Civil';
        case 7:
          return 'Marine';
        case 8:
          return 'Petrolium';
        default:
          return '';

      }
    }

  }

  addUsersInBoard() {
    let body = {
      "boardId": this.boardId,
      "emails": this.usersForm.get("addPeopleList").value.split(",")
    };
    this.service.addUsersInBoard(body).subscribe((resData: any) => {
      console.log(resData);
      if (resData.statusCode == "ERROR") {
        this.toastr.error("Failed", resData.info);
      } else if (resData && resData.code && resData.code.name == "Error") {
        this.toastr.error("Failed", "Something went wrong!");
      } else if (resData && resData.error && resData.error.code) {
        this.toastr.error("Failed", "Something went wrong!");
      } else {
        this.validAddUsers = false;
        this.boardResponse = resData;
        this.getUsersInClosedBoard(this.boardId)
      }
    })
  }

  removeUsersInBoard() {
    let body = {
      "boardId": this.boardId,
      "emails": this.usersForm.get("removePeopleList").value.split(",")
    };
    this.service.removeUsersInBoard(body).subscribe((resData: any) => {
      console.log(resData);
      if (resData.statusCode == "ERROR") {
        this.toastr.error("Failed", resData.info);
      } else if (resData && resData.code && resData.code.name == "Error") {
        this.toastr.error("Failed", "Something went wrong!");
      } else if (resData && resData.error && resData.error.code) {
        this.toastr.error("Failed", "Something went wrong!");
      } else {
        this.validRemoveUsers = false;
        this.boardResponse = resData;
        this.getUsersInClosedBoard(this.boardId)
      }
    })
  }
  addAdminsInBoard() {
    let emails = this.usersForm.get("addAdminsList").value.split(",");
    let admins = [];
    emails.forEach(element => {
      let o = {email: element}
      admins.push(o);
    });

    let body = {
      "boardId": this.boardId,
      "admins": admins
    };
    this.service.addAdminsInBoard(body).subscribe((resData: any) => {
      console.log(resData);
      if (resData.statusCode == "ERROR") {
        this.toastr.error("Failed", resData.info);
      } else if (resData && resData.code && resData.code.name == "Error") {
        this.toastr.error("Failed", "Something went wrong!");
      } else if (resData && resData.error && resData.error.code) {
        this.toastr.error("Failed", "Something went wrong!");
      } else {
        this.validAddAdmins = false;
        this.boardResponse = resData;
        this.getUsersInClosedBoard(this.boardId)
      }
    })
  }

  createBoardDialog(content: any) {
    this.boardModalReference = this.modalService.open(content, this.windowStyle);
    this.boardModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
     });
  }

  resetForm() {
    this.addBoardForm.get("instId").patchValue(null);
    this.addBoardForm.get("deptId").patchValue(null);
    this.addBoardForm.get("startYear").patchValue(null);
    this.addBoardForm.get("endYear").patchValue(null);
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

  saveCreateBoard() {
    this.addBoardBtnTxt = "Creating..";
    this.service.createBoardInstAdmin(this.addBoardForm.value).subscribe((resData: any) => {
      this.addBoardBtnTxt = "Create";
      if (resData && resData.error && resData.error.code) {
        this.toastr.error("Failed", "Something went wrong!");
      } else {
        this.toastr.success("Success", "Board Created successfully")
        this.boardModalReference.close();
        this.getAdminClosedBoards();
      }
    });
  }

  checkEmail(email) {
    let regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(email);
  }

  checkEmails(emails: any, type: any) {
    if (emails.length > 0) {
      let emailArray = emails.split(",");
      for (let i = 0; i <= (emailArray.length - 1); i++) {
        if (this.checkEmail(emailArray[i])) {
          //Do what ever with the email.
          if (type == "add") {
            this.validAddUsers = true;
          } else if(type = "addAdmins"){
            this.validAddAdmins = true;
          } else {
            this.validRemoveUsers = true;
          }
        } else {
          if (type == "add") {
            this.validAddUsers = false;
          } else if(type = "addAdmins"){
            this.validAddAdmins = false;
          } else {
            this.validRemoveUsers = false;
          }
          // alert("invalid email: " + emailArray[i]);
        }
      }
    }
  }
}

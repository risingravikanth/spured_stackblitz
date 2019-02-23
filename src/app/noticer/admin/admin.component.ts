import { Component, OnInit } from '@angular/core';
import { MobileDetectionService } from '../../shared';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { SideMenuService } from '../noticer-main/side-menu/side-menu.service';
import { AdminService } from './admin.service';
import { ToastrService } from '../../shared/services/Toastr.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [MobileDetectionService, CurrentUserService, SideMenuService, AdminService, ToastrService]
})
export class AdminComponent implements OnInit {

  public listOfBoards: any = [];
  public peopleInBoards: any = [];
  public isMobile: boolean;
  public currentUser: any;
  public boardId: any;
  showPeople: boolean = false;
  validAddUsers: boolean = false;
  validRemoveUsers: boolean = false;
  public usersForm: FormGroup;
  public addBoardForm: FormGroup;
  boardName: any;
  deptName: any;
  startYear: any;
  endYear: any;
  listOfDepartments: any;
  public boardModalReference: NgbModalRef;
  closeResult: string;
  windowStyle: any;
  constructor(private fb: FormBuilder, private mobileService: MobileDetectionService, private userService: CurrentUserService,
    private leftMenuService: SideMenuService, private service: AdminService, private toastr: ToastrService,
    private modalService: NgbModal) {

  }

  ngOnInit() {
    this.usersForm = this.fb.group({
      addPeopleList: [""],
      removePeopleList: [""]
    })
    this.addBoardForm = this.fb.group({
      instId: [null, Validators.required],
      deptId: [null, Validators.required],
      startYear: [null, Validators.required],
      endYear: [null, Validators.required]
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
  }

  getAdminClosedBoards() {
    this.leftMenuService.getUserClosedBoards().subscribe(resData => {
      if (resData.boards) {
        for (var i in resData.boards) {
          let item = resData.boards[i];
          let id = item['boardId'];
          let name = item['boardName'];
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
    this.boardName = this.listOfBoards.filter(item => item.value == boardId)[0].label;
    let ar = this.boardName.split(" ");
    if (ar.length == 3) {
      this.deptName = ar[1];
      this.startYear = ar[2].split("-")[0];
      this.endYear = ar[2].split("-")[1];
    }
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
      } else {
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
      } else {
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

  saveCreateBoard(){
    alert("In progress")
  }

  checkEmail(email) {
    let regExp = /(^[a-z]([a-z_\.]*)@([a-z_\.]*)([.][a-z]{3})$)|(^[a-z]([a-z_\.]*)@([a-z_\.]*)(\.[a-z]{3})(\.[a-z]{2})*$)/i;
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
          } else {
            this.validRemoveUsers = true;
          }
        } else {
          if (type == "add") {
            this.validAddUsers = false;
          } else {
            this.validRemoveUsers = false;
          }
          alert("invalid email: " + emailArray[i]);
        }
      }
    }
  }

}

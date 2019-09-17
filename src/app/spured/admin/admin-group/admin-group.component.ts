import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/debounceTime';
import { MobileDetectionService } from '../../../shared';
import { CurrentUserService } from '../../../shared/services/currentUser.service';
import { ToastrService } from '../../../shared/services/Toastr.service';
import { LeftMenuService } from '../../core-main/left-menu/left-menu.service';
import { AdminGroupService } from './admin-group.service';

@Component({
  selector: 'admin-group',
  templateUrl: './admin-group.component.html',
  styleUrls: ['./admin-group.component.css'],
  providers: [MobileDetectionService, CurrentUserService, LeftMenuService, AdminGroupService, ToastrService]
})
export class AdminGroupComponent implements OnInit {

  public boardResponse: any;

  public listOfGroups: any = [];
  public listOfDepartments: any = [];
  public peopleInBoards: any = [];
  public isMobile: boolean;
  public currentUser: any;
  public groupId: any;
  showPeople: boolean = false;
  validAddUsers: boolean = false;
  validRemoveUsers: boolean = false;
  public usersForm: FormGroup;
  public addGroupForm: FormGroup;
  boardName: any;
  deptName: any;
  instName: any;
  startYear: any;
  endYear: any;
  public boardModalReference: NgbModalRef;
  closeResult: string;
  windowStyle: any;
  addBoardBtnTxt: string = "Create";

  institute: any;
  @Input()
  set fromChild(value: any) {
    if (value) {
      this.institute = value
      this.addGroupForm.controls['institute'].get("instId").patchValue(this.institute.instId);
    }
  }

  @Input()
  set fromChildDepts(value: any) {
    if (value) {
      this.listOfDepartments = value
    }
  }

  constructor(private fb: FormBuilder, private mobileService: MobileDetectionService, private userService: CurrentUserService,
    private leftMenuService: LeftMenuService, private service: AdminGroupService, private toastr: ToastrService,
    private modalService: NgbModal) {

  }

  ngOnInit() {
    this.usersForm = this.fb.group({
      addPeopleList: [""],
      removePeopleList: [""]
    })
    this.addGroupForm = this.fb.group({
      institute: this.fb.group({
        instId: [null, Validators.required]
      }),
      name: [null, Validators.required],
      _type: ["Group", Validators.required],
      groupType: ["INSTITUTE", Validators.required]
    })

    this.isMobile = this.mobileService.isMobile();
    if (this.isMobile) {
      this.windowStyle = { size: "lg" }
    } else {
      this.windowStyle = { windowClass: "myCustomModalClass" }
    }
    this.currentUser = this.userService.getCurrentUser();
    this.getAdminGroups();
    this.usersForm.controls['addPeopleList'].valueChanges
      .debounceTime(1000)
      .subscribe(newValue => this.checkEmails(newValue, "add"));
    this.usersForm.controls['removePeopleList'].valueChanges
      .debounceTime(1000)
      .subscribe(newValue => this.checkEmails(newValue, "remove"));
  }

  getAdminGroups() {
    this.service.getMyAdminGroups().subscribe((resData: any) => {
      if (resData.groups) {
        for (var i in resData.groups) {
          let item = resData.groups[i];
          let id = item['id'];
          let name = item['name'];
          var obj = {
            value: id,
            label: name
          };
          this.listOfGroups.push(obj);
        }
      }
    });
    // this.service.getAdminPublicGroups().subscribe((resData: any) => {
    //   if (resData.groups) {
    //     for (var i in resData.groups) {
    //       let item = resData.groups[i];
    //       let id = item['id'];
    //       let name = item['name'];
    //       var obj = {
    //         value: id,
    //         label: name
    //       };
    //       this.listOfGroups.push(obj);
    //     }
    //   }
    // });
  }

  getUsersInGroup(boardId: any) {
    // this.boardName = this.listOfGroups.filter(item => item.value == boardId)[0].label;
    // let ar = this.boardName.split(" ");
    // if (ar.length == 3) {
    //   this.deptName = ar[1];
    //   this.startYear = ar[2].split("-")[0];
    //   this.endYear = ar[2].split("-")[1];
    // }
    this.service.getUsersInGroup(boardId).subscribe(
      (resData: any) => {
        this.usersForm.get("addPeopleList").patchValue("");
        this.usersForm.get("removePeopleList").patchValue("");
        if (resData && resData.userPfofiles.length > 0) {
          this.peopleInBoards = resData.userPfofiles;
          this.showPeople = true;
        } else {
          this.showPeople = false;
        }
      }
    )
  }

  addUsersInGroup() {
    let body = {
      "groupId": this.groupId,
      "emails": this.usersForm.get("addPeopleList").value.split(",")
    };
    this.service.addUsersGroup(body).subscribe((resData: any) => {
      console.log(resData);
      if (resData.statusCode == "ERROR") {
        this.toastr.error("Failed", resData.info);
      } else if (resData && resData.code && resData.code.name == "Error") {
        this.toastr.error("Failed", "Something went wrong!");
      } else if (resData && resData.error && resData.error.code) {
        this.toastr.error("Failed", "Something went wrong!");
      } else {
        this.boardResponse = resData;
        console.log(this.boardResponse);
        this.getUsersInGroup(this.groupId)
        this.validAddUsers = false;
      }
    })
  }

  removeUsersInGroup() {
    let body = {
      "groupId": this.groupId,
      "emails": this.usersForm.get("removePeopleList").value.split(",")
    };
    this.service.removeUsersGroup(body).subscribe((resData: any) => {
      console.log(resData);
      if (resData.statusCode == "ERROR") {
        this.toastr.error("Failed", resData.info);
      } else if (resData && resData.code && resData.code.name == "Error") {
        this.toastr.error("Failed", "Something went wrong!");
      } else if (resData && resData.error && resData.error.code) {
        this.toastr.error("Failed", "Something went wrong!");
      } else {
        this.boardResponse = resData;
        console.log(this.boardResponse);
        this.getUsersInGroup(this.groupId);
        this.validRemoveUsers = false;
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

  saveCreateGroup() {
    this.addBoardBtnTxt = "Creating..";
    let body = { data: this.addGroupForm.value }
    this.service.createGroupInstAdmin(body).subscribe((resData: any) => {
      this.addBoardBtnTxt = "Create";
      if (resData && resData.error && resData.error.code) {
        this.toastr.error("Failed", "Something went wrong!");
      } else {
        this.toastr.success("Success", "Group Created successfully")
        this.boardModalReference.close();
        this.getAdminGroups();
      }
    });
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
          // alert("invalid email: " + emailArray[i]);
        }
      }
    }
  }


}

import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { routerTransition } from "../../router.animations";
import { SettingsService } from './settings.service';
import { isPlatformBrowser } from '@angular/common';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import * as constant from '../../shared/others/constants'
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [SettingsService],
  animations: [routerTransition()]
})
export class SettingsComponent implements OnInit {

  changePassword: FormGroup;
  public getAllRequestsList: any = [];
  public profileImage: any;
  public currentUser: User;
  serverUrl: string;
  public showReq = false;
  public defaultImage: any = "assets/images/noticer_default_user_img.png";

  constructor(private router: Router, private formbuilder: FormBuilder, private service: SettingsService,
    private userService: CurrentUserService, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.userService.getCurrentUser();
      this.serverUrl = constant.REST_API_URL + "/";
    }
  }

  ngOnInit() {
    this.initForm();
    this.boardRequests();
  }

  initForm() {
    this.changePassword = this.formbuilder.group({
      existingPassword: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  savePassword() {
    console.log("save password");
    if (this.changePassword.valid) {
      this.service.updatePassword(this.changePassword.value).subscribe(
        (resData: any) => {
          console.log(resData);
          alert(resData.info);
          this.initForm();
        }
      )
    }
  }


  boardRequests() {
    this.service.getAllRequests().subscribe(
      resData => {
        this.getAllRequestsList = resData;
        if (this.getAllRequestsList && this.getAllRequestsList.code == "ERROR") {
          alert(this.getAllRequestsList.info);
          this.showReq = false;
        } else if (this.getAllRequestsList && this.getAllRequestsList.length > 0) {
          this.showReq = true;
        } else {
          this.showReq = false;
        }
      }
    )
  }

  updateStatus(reqId: any, status: any) {
    let obj = {
      "reqId" : reqId,
      "status" : status
    }
    let index = this.getAllRequestsList.findIndex(item => item.reqId == reqId);
    this.service.updateBoardReq(obj).subscribe((resData:any) =>{
      if (resData && resData.statusCode == "ERROR") {
        alert(resData.info)
      } else {
        alert("Request update successfully")
        this.getAllRequestsList.splice(index, 1);
      }
    })
  }
}

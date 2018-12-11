import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import * as constant from '../../shared/others/constants';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { ToastrService } from '../../shared/services/Toastr.service';
import { SettingsService } from './settings.service';
import { MobileDetectionService } from '../../shared';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [SettingsService,ToastrService ]
})
export class SettingsComponent implements OnInit {

  changePassword: FormGroup;
  public getAllRequestsList: any = [];
  public profileImage: any;
  public currentUser: User;
  serverUrl: string;
  public showReq = false;
  public defaultImage: any = "assets/images/noticer_default_user_img.png";
  public isMobile = false;

  constructor(private router: Router, private formbuilder: FormBuilder, private service: SettingsService,
    private userService: CurrentUserService, @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService, private mobileServie:MobileDetectionService) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.userService.getCurrentUser();
      this.serverUrl = constant.REST_API_URL + "/";
    }
  }

  ngOnInit() {
    this.isMobile = this.mobileServie.isMobile();
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
      (resData:any) => {
        if (resData && resData.code == "ERROR") {
          alert(resData.info);
          this.showReq = false;
        } else if (resData  && resData && resData.requests.length > 0) {
          this.getAllRequestsList = resData.requests;
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
        this.toastr.success("Failed", resData.info);
      } else {
        this.toastr.success("Success", "Request update successfully");
        this.getAllRequestsList.splice(index, 1);
      }
    })
  }

  redirectToOtherProfile(userId: any) {
    this.router.navigate(['profile/users/' + userId]);
  }
}

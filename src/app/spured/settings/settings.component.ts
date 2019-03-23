import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import * as constant from '../../shared/others/constants';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { ToastrService } from '../../shared/services/Toastr.service';
import { SettingsService } from './settings.service';
import { MobileDetectionService, SeoService } from '../../shared';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [SettingsService, ToastrService, SeoService, CurrentUserService]
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
  authForm: FormGroup;

  constructor(private router: Router, private formbuilder: FormBuilder, private service: SettingsService,
    private userService: CurrentUserService, @Inject(PLATFORM_ID) private platformId: Object,
    private toastr: ToastrService, private mobileServie: MobileDetectionService, private fb: FormBuilder,
    private authService:AuthService,
    private seo:SeoService) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.userService.getCurrentUser();
    }
  }

  ngOnInit() {
    this.isMobile = this.mobileServie.isMobile();
    this.initForm();
    this.boardRequests();

    this.initDeleteForm();

    this.seo.generateTags({
      title: 'SpurEd - Spur: Give encouragement to Ed: Education',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'feed-page'
    })
    this.userService.setTitle("Settings - SpurEd")
  }

  initDeleteForm() {
    this.authForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', Validators.required]
    });
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
      (resData: any) => {
        if (resData && resData.code == "ERROR") {
          alert(resData.info);
          this.showReq = false;
        } else if (resData && resData.requests && resData.requests.length > 0) {
          this.getAllRequestsList = resData.requests;
          this.showReq = true;
        } else {
          this.showReq = false;
        }
      }
    )
  }

  imageFromAws(url) {
    return url.indexOf("https://") != -1 ? true : false;
  }

  updateStatus(reqId: any, status: any) {
    let obj = {
      "reqId": reqId,
      "status": status
    }
    let index = this.getAllRequestsList.findIndex(item => item.reqId == reqId);
    this.service.updateBoardReq(obj).subscribe((resData: any) => {
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

  display: boolean = false;

  showDialog() {
    this.display = true;
  }

  delteProfile(){
    this.service.deleteProfile(this.authForm.value).subscribe(
      (resData:any) =>{
        this.initDeleteForm();
        if(resData && resData.info == "Incorrect Email or Password"){
          this.toastr.error("Failed", resData.info);
        } else if(resData && resData.info == "Deleted Successfully"){
          this.toastr.success("Success", "Your account deleted successfully!");
          this.authService.purgeAuth();
          this.router.navigate(["/login"])
        } else{
          this.toastr.error("Failed", "Something went wrong");
        }
      }
    )
  }
}

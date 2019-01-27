import { Component, OnInit } from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ToastrService } from '../shared/services/Toastr.service';
import { SeoService } from '../shared';
import { CurrentUserService } from '../shared/services/currentUser.service';
const MY_DATA = makeStateKey('ACCOUNT_ACTIVATION');

@Component({
  selector: 'account-activate',
  templateUrl: './account-activate.component.html',
  styleUrls: ['./account-activate.component.css'],
  providers: [AuthService, ToastrService,
    CurrentUserService, SeoService]
})
export class AccountActivateComponent implements OnInit {

  public code: any;
  message: any;
  public tokenDetails: any;
  public isValiUser: boolean = false
  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private state: TransferState,
    private seo: SeoService,
    private userService: CurrentUserService) {

  }

  ngOnInit() {
    this.seo.generateTags({
      title: 'SpurEd - Spur: Give encouragement to Ed: Education',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'feed-page'
    })
    this.userService.setTitle("SpurEd - Spur: Give encouragement to Ed: Education")
    this.route.params.subscribe(this.handleParams.bind(this));
  }

  handleParams(params: any) {

    this.code = params['code']

    const store = this.state.get(MY_DATA, null);
    if (store) {
      console.log("store");
      console.log(store);
      this.doWithResponse(store);
      return;
    }
    if (this.code) {
      this.message = "Validating... Please wait..."
      this.authService.activateUserThroughUrl(this.code).subscribe(
        (resData: any) => {
          this.state.set(MY_DATA, resData);
          console.log("resData");
          console.log(resData);
          this.doWithResponse(resData);
        })
    } else {
      alert("Wrong url");
      this.toastr.error("Failed", "Wrong url");
    }
  }

  doWithResponse(resData) {
    if (resData && resData.info) {
      this.message = resData.info;
    } else if (resData && resData.userId) {
      this.message = "Your account is successfully activated";
      this.isValiUser = true;
      this.tokenDetails = resData;
    } else {
      this.message = "";
    }
  }

  continueTOLogin() {
    if (this.tokenDetails) {
      this.authService.setAuth(this.tokenDetails);
      this.toastr.success("Success", "Login sucessfull!");
      this.router.navigate(['/feed']);
    }
  }

}

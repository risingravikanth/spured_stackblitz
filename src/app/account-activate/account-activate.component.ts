import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ToastrService } from '../shared/services/Toastr.service';

@Component({
  selector: 'account-activate',
  templateUrl: './account-activate.component.html',
  styleUrls: ['./account-activate.component.css'],
  providers: [AuthService, ToastrService]
})
export class AccountActivateComponent implements OnInit {

  public code: any;
  message: any;
  public tokenDetails: any;
  public isValiUser:boolean = false
  constructor(private route: ActivatedRoute,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) {

  }

  ngOnInit() {
    this.route.params.subscribe(this.handleParams.bind(this));
  }

  handleParams(params: any) {

    this.code = params['code']

    if (this.code) {
      this.message = "Validating... Please wait..."
      this.authService.activateUserThroughUrl(this.code).subscribe(
        (resData: any) => {
          if (resData && resData.info) {
            this.message = resData.info;
          } else if (resData && resData.userId) {
            this.message = "Your account is successfully activate";
            this.isValiUser = true;
            this.tokenDetails = resData;
          } else{
            this.message = "";
          }
        }
      )
    } else {
      alert("Wrong url");
      this.toastr.error("Failed", "Wrong url");
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
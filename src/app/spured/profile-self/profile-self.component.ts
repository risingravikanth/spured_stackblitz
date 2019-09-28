import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IMyDpOptions } from 'mydatepicker';
import { MessageService } from "primeng/components/common/messageservice";
import { User } from '../../shared/models/user.model';
import * as constant from '../../shared/others/constants';
import { CustomValidator } from "../../shared/others/custom.validator";
import { CommonService, SeoService } from '../../shared/services';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { ToastrService } from '../../shared/services/Toastr.service';
import { SelfProfileService } from './profile-self.service';

@Component({
    selector: 'profile-self',
    templateUrl: './profile-self.component.html',
    styleUrls: ['./profile-self.component.css'],
    providers: [SelfProfileService, CustomValidator, MessageService, SeoService, ToastrService]
})
export class SelfProfileComponent implements OnInit {

    constructor(private router: Router,
        private modalService: NgbModal,
        private formbuilder: FormBuilder,
        private service: SelfProfileService,
        private userService: CurrentUserService,
        private seo: SeoService,
        private commonService: CommonService,
        private toastr:ToastrService) { }

    editProfileForm: FormGroup;

    public profileLoader = false;
    public educationLoader = false;
    public examLoader = false;
    public examuralLoader = false;
    public mypostsLoader = false;
    public urls: any = [];
    public userDetails: any;

    public categoryModalReference: NgbModalRef;
    closeResult: string;
    currentUser: User;
    currentuserId: any;
    public profileImage;

    public showSpinner = false;
    public color = "primary";
    public mode = "indeterminate";
    public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
    };

    ngOnInit() {
        this.seo.generateTags({
            title: 'SpurEd - Spur Encouragement to Education',
            description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
            slug: 'feed-page'
          })
          this.userService.setTitle("SpurEd - Spur Encouragement to Education")

        this.currentUser = this.userService.getCurrentUser();
        if (this.currentUser) {
            this.currentuserId = this.currentUser.userId;
            this.loadProfileDetails(this.currentuserId);
            if (this.currentUser && this.currentUser.imageUrl) {
                this.profileImage = this.currentUser.imageUrl;
            } else {
                this.profileImage = "assets/images/noticer_default_user_img.png"
            }
        } else {
            this.router.navigate(['/login']);
        }
        this.initForm();
    }


    imageFromAws(url){
        return url.indexOf("https://") != -1 ? true : false;
      }

    initForm() {
        this.editProfileForm = this.formbuilder.group(
            {
                userId: [null],
                userName: [null],
                firstName: [null, Validators.required],
                lastName: [null, Validators.required],
                email: [null],
                phoneNum: [null],
                gender: [null, Validators.required],
                dob: [null],
                dobDate: [null],
                dobMonth: [null],
                dobYear: [null],
                permAddress: [null],
                currAddress: [null],
                profileImageUrl: [null]
            }
        )
    }

    loadProfileDetails(userId: any) {
        console.log("get profile details");
        this.showSpinner = true;
        this.service.getUserInfo(userId).subscribe(resData => {
            this.showSpinner = false;
            this.userDetails = resData;
            this.userService.setTitle(this.userDetails.userName + " - SpurEd");
        }, error => {
            this.showSpinner = false;
            this.toastr.error("Failed", "Something went wrong!");
        })
    }
    loadEducationDetails() {
        console.log("get education details");
    }
    loadExamDetails() {
        console.log("get exam details");
    }
    loadExamuralDetails() {
        console.log("get examural details");
    }

    fnChangeProfilePicture(event) {
        if (event.target.files.length == 1) {
            this.urls = [];
            let files = event.target.files;
            if (files) {
                for (let file of files) {
                    let reader = new FileReader();
                    reader.onload = (e: any) => {
                        this.urls.push(e.target.result);
                    }
                    reader.readAsDataURL(file);
                    let formData: FormData = new FormData();
                    formData.append('file', file);
                    this.showSpinner = true;
                    this.service.uploadImage(formData).subscribe((resData: any) => {
                        if (resData && resData.error && resData.error.code) {
                            this.toastr.error("Update Failed", resData.error.code.longMessage);
                        } else {
                            this.initForm();
                            this.editProfileForm.controls['profileImageUrl'].patchValue(resData.url);
                            this.userDetails.profileImageUrl = resData.url;
                            this.currentUser.imageUrl = resData.url;
                            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                            this.profileImage = resData.url;
                            this.saveEditProfile("imageUpdate");
                        }
                        this.showSpinner = false;
                    }, error => {
                        this.showSpinner = false;
                        this.toastr.error("Failed", "Something went wrong!");
                    })
                }
            }
        } else {
            this.toastr.error("Failed", "Only one picture allowd");
            event.preventDefault();
        }

    }

    editProfile(content: any) {
        this.setValuesToForm();
        this.categoryModalReference = this.modalService.open(content, { size: 'lg' });
        this.categoryModalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log(this.closeResult);
            this.setValuesToForm();
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    setValuesToForm() {
        this.editProfileForm.controls['userId'].patchValue(this.userDetails.userId)
        this.editProfileForm.controls['userName'].patchValue(this.userDetails.userName)
        this.editProfileForm.controls['firstName'].patchValue(this.userDetails.firstName)
        this.editProfileForm.controls['lastName'].patchValue(this.userDetails.lastName)
        this.editProfileForm.controls['phoneNum'].patchValue(this.userDetails.phoneNum)
        this.editProfileForm.controls['gender'].patchValue(this.userDetails.gender)
        this.editProfileForm.controls['permAddress'].patchValue(this.userDetails.permAddress)
        this.editProfileForm.controls['currAddress'].patchValue(this.userDetails.currAddress)

        if (this.userDetails.dobDate && this.userDetails.dobMonth && this.userDetails.dobYear) {
            let dt = { date: { year: this.userDetails.dobYear, month: this.userDetails.dobMonth, day: this.userDetails.dobDate } }
            this.editProfileForm.controls['dob'].patchValue(dt)
        } else {
            this.editProfileForm.controls['dob'].patchValue(new Date());
        }
    }

    private getDismissReason(reason: any): string {
        this.initForm();
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    saveEditProfile(from: any) {
        this.showSpinner = true;
        console.log(this.editProfileForm.value);
        let dob = this.editProfileForm.controls['dob'].value;
        if (dob && dob.date) {
            this.editProfileForm.controls['dobDate'].patchValue(dob.date.day);
            this.editProfileForm.controls['dobMonth'].patchValue(dob.date.month);
            this.editProfileForm.controls['dobYear'].patchValue(dob.date.year);
        }
        this.service.saveEditProfile(this.editProfileForm.value).subscribe((resData: any) => {
            console.log(resData.info);
            this.showSpinner = false;
            if (from != "imageUpdate") {
                if (resData.info) {
                    this.toastr.success("Update Success", resData.info);
                }
                this.categoryModalReference.close();
                this.initForm();
            } else {
                this.initForm();
                this.toastr.success("Success", "Profile picture updated successfully!");
                this.commonService.updateHeaderMenu("updateProfilePic");
            }
            this.loadProfileDetails(this.currentuserId);
        }, error => {
            this.showSpinner = false;
            this.toastr.error("Failed", "Something went wrong!");
        })
    }


}

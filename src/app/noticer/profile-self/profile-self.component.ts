import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from "primeng/components/common/messageservice";
import { routerTransition } from "../../router.animations";
import { CustomValidator } from "../../shared/others/custom.validator";
import { SelfProfileService } from './profile-self.service';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'profile-self',
  templateUrl: './profile-self.component.html',
  styleUrls: ['./profile-self.component.css'],
  providers: [SelfProfileService, CustomValidator, MessageService],
  animations: [routerTransition()]
})
export class SelfProfileComponent implements OnInit {

  constructor(private router: Router,
    private modalService: NgbModal,
    private formbuilder: FormBuilder,
    private service: SelfProfileService,
    private customValidator: CustomValidator,
    private userService: CurrentUserService) { }

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

  ngOnInit() {
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


  initForm() {
    this.editProfileForm = this.formbuilder.group(
      {
        userName: [''],
        email: [''],
        phoneNum: [''],
        gender: [''],
        address: ['']
      }
    )
  }

  loadProfileDetails(userId: any) {
    console.log("get profile details");
    this.service.getUserInfo(userId).subscribe(resData => {
      this.userDetails = resData;
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
        }
      }
    } else {
      alert("Please select only one picture");
      event.preventDefault();
    }

  }

  editProfile(content: any) {
    this.categoryModalReference = this.modalService.open(content, { size: 'lg' });
    this.categoryModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  saveEditProfile() {
    this.categoryModalReference.close();
  }


}

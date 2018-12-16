import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from '../../shared/services/Toastr.service';
import { NoticerMainService } from '../noticer-main/noticer-main.service';

@Component({
  selector: 'report-us',
  templateUrl: './report-us.component.html',
  styleUrls: ['./report-us.component.css'],
  providers: [ToastrService, NoticerMainService]
})
export class ReportUsComponent implements OnInit {

  public urls = new Array<string>();

  reportIssueForm: FormGroup;
  public reportImage: any;
  public imgurls: any;
  public btnTxt = "Report"

  constructor(private formbuilder: FormBuilder, private toastr: ToastrService,
    private service: NoticerMainService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.reportIssueForm = this.formbuilder.group(
      {
        type: [null, Validators.required],
        issue: [null, Validators.required],
        imageUrl: [],
        img: [null]
      }
    )

  }


  reportIssue() {
    console.log(this.reportIssueForm.value);
    this.btnTxt = "Reporting..."
    this.saveImage();
  }

  detectFiles(event) {
    let files = event.target.files;
    if (files.length > 1 || (this.urls.length + files.length) > 1) {
      this.toastr.error("Failed", "Only 4 images allowed");
    } else if (files) {
      for (let file of files) {
        let reader = new FileReader();
        let found = [];
        reader.onload = (e: any) => {
          found = this.urls.filter(item => item == e.target.result);
          if (found.length == 0) {
            this.urls.push(e.target.result);
          }
        }
        reader.readAsDataURL(file);
        if (found.length == 0) {
          this.reportImage = file;
        }
      }
    }
  }

  saveImage() {
    if (this.reportImage) {
      let formData: FormData = new FormData();
      formData.append('file', this.reportImage);
      this.service.uploadImage(formData).subscribe((resData: any) => {
        if (resData && resData.error && resData.error.code) {
          this.toastr.error("Failed", resData.error.code.longMessage);
        } else {
          this.imgurls = resData.url;
        }
        if (this.imgurls.length > 0) {
          this.reportIssueForm.controls["imageUrl"].patchValue(this.imgurls);
          this.saveReportIssue();
        }
      }, error => {
        this.btnTxt = "Report";
        this.toastr.error("Failed", "Something went wrong!");
      })
    } else {
      this.saveReportIssue();
    }
  }

  saveReportIssue() {
    this.service.reportIssue(this.reportIssueForm.value).subscribe((resData: any) => {
      this.btnTxt = "Report";
      if (resData && resData.recordId) {
        this.initForm();
        this.reportImage = null;
        this.imgurls = "";
        this.toastr.success("Success", "Your issue reported successfully");
      } else {
        this.toastr.error("Failed", "Something went wrong!");
      }
    }, error => {
      this.btnTxt = "Report";
      this.toastr.error("Failed", "Something went wrong!");
    })
  }

}

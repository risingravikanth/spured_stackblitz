import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Message } from 'primeng/components/common/api';
import { ElementRef } from '@angular/core';
import { CustomValidator } from '../../../shared/others/custom.validator';
import { MessageService } from 'primeng/components/common/messageservice';
import { routerTransition } from '../../../router.animations';
import { CommonService } from '../../../shared/services/common.service';
import { Section } from '../../../shared/models/section.model';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  providers: [CustomValidator, MessageService],
  animations: [routerTransition()]
})
export class SideMenuComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder, private commonService: CommonService, private customValidator: CustomValidator, private modalService: NgbModal) { }

  @ViewChild('myTopnav') el: ElementRef;

  public menuList: any = [];
  public isClassVisible = false;
  private toggleTopics: any;
  public isPosFix = true;
  public varShowSectionSettings = true;
  public varShowSectionOptions = false;
  public questionName: any = '';
  public selected: any;

  closeResult: string;
  public sectionModalReference: NgbModalRef;
  public categoryModalReference: NgbModalRef;

  ngOnInit() {
    this.initTypes();

    this.commonService.toggleTopics.subscribe(toggelS => {
      this.isClassVisible = toggelS;
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


  saveSectionSettings() {

  }


  cacelSectionSettings() {
    this.varShowSectionSettings = true;
    this.varShowSectionOptions = false;
  }

  showSectionSettingsM() {
    this.varShowSectionSettings = false;
    this.varShowSectionOptions = true;
  }


  showAddCategoryDialog(content: any) {
    console.log("add category");
    this.categoryModalReference = this.modalService.open(content);
    this.categoryModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(this.closeResult);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  showAddSectionDialog(content: any) {
    console.log("add section");
    this.sectionModalReference = this.modalService.open(content);
    this.sectionModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  saveModelCategories() {
    this.categoryModalReference.close();
  }

  saveModelSecions() {
    this.sectionModalReference.close();
  }


  public selectedItem;
  selectedCategory(sec: any, cat: any) {
    let data = new Section();
    data.section = sec;
    data.category = cat;
    if (cat == "HOME") {
      this.selectedItem = sec+"HOME"
    } else {
      this.selectedItem = sec+cat;
    }

    // this.commonService.updateByFilter(data);
    // if(sec && cat){
    //   this.router.navigate(['/noticer'],
    //        {queryParams: {type: sec, category: cat}});
    // } else if(sec){
    //   this.router.navigate(['/noticer'],
    //        {queryParams: {type: sec}});
    // }
  }


  myFunction() {
    let cName: string = this.el.nativeElement.className;
    console.log(cName)
    if (cName === "topnav") {
      this.isClassVisible = true;
    } else {
      this.isClassVisible = false;
    }
  }



  select(item) {
    this.selected = (this.selected === item ? null : item);
  }
  isActive(item) {
    return this.selected === item;
  }


  initTypes() {
    this.menuList = [
      {
        "title": "Topics",
        "select": false,
        "sections": [
          {
            "name": "Quants",
            "code": "quants",
            "categories": [
              {
                "name": "HOME",
                "code": "home"
              },
              {
                "name": "CAT",
                "code": "cat"
              },
              {
                "name": "GMAT",
                "code": "gmat"
              },
              {
                "name": "MAT",
                "code": "mat"
              },
              {
                "name": "GRE",
                "code": "gre"
              },
              {
                "name": "TOFEL",
                "code": "tofel"
              },
              {
                "name": "RAILWAY EXAMS",
                "code": "railwayexams"
              },
              {
                "name": "BANK EXAMS",
                "code": "bankexams"
              },
              {
                "name": "OTHERS",
                "code": "Others"
              }
            ]
          },
          {
            "name": "Verbal",
            "code": "verbal",
            "categories": [
              {
                "name": "HOME",
                "code": "home"
              },
              {
                "name": "CAT",
                "code": "cat"
              },
              {
                "name": "GMAT",
                "code": "gmat"
              },
              {
                "name": "MAT",
                "code": "mat"
              },
              {
                "name": "GRE",
                "code": "gre"
              },
              {
                "name": "TOFEL",
                "code": "tofel"
              },
              {
                "name": "RAILWAY EXAMS",
                "code": "railwayexams"
              },
              {
                "name": "BANK EXAMS",
                "code": "bankexams"
              },
              {
                "name": "OTHERS",
                "code": "Others"
              }
            ]
          },
          {
            "name": "General Knowledge",
            "code": "gk",
            "categories": [
              {
                "name": "HOME",
                "code": "home"
              },
              {
                "name": "RAILWAY EXAMS",
                "code": "railwayexams"
              },
              {
                "name": "BANK EXAMS",
                "code": "bankexams"
              },
              {
                "name": "OTHERS",
                "code": "Others"
              }
            ]
          },
          {
            "name": "Careers",
            "code": "careers",
            "categories": [
              {
                "name": "HOME",
                "code": "home"
              },
              {
                "name": "JOBS",
                "code": "jobs"
              }
            ]
          },
          {
            "name": "Events",
            "code": "events",
            "categories": [
              {
                "name": "HOME",
                "code": "home"
              },
              {
                "name": "CULTURAL",
                "code": "CULTURAL"
              },
              {
                "name": "TECHNICAL",
                "code": "TECHNICAL"
              },
              {
                "name": "SPORTS",
                "code": "SPORTS"
              },
              {
                "name": "MANGAGEMENT",
                "code": "MANAGEMENT"
              },
              {
                "name": "FUN",
                "code": "FUN"
              },
              {
                "name": "OTHERS",
                "code": "OTHERS"
              }
            ]
          },
          {
            "name": "News",
            "code": "news",
            "categories": [
              {
                "name": "HOME",
                "code": "home"
              }
            ]
          }
        ]
      }
      // ,
      // {
      //   "title": "Boards",
      //   "select": false,
      //   "sections": [
      //     {
      //       "name": "Open",
      //       "code": "open",
      //       "categories": [
      //         {
      //           "name": "HOME",
      //           "code": "home"
      //         },
      //         {
      //           "name": "JNTU Kakinada",
      //           "code": "jntuk"
      //         },
      //         {
      //           "name": "RGUKT CSE 2000-03",
      //           "code": "1132"
      //         }
      //       ]
      //     },
      //     {
      //       "name": "Close",
      //       "code": "close",
      //       "categories": [
      //         {
      //           "name": "HOME",
      //           "code": "home"
      //         },
      //         {
      //           "name": "RGUKT Nuzivid",
      //           "code": "rgukt-nzv"
      //         },
      //         {
      //           "name": "RGUKT Nuzivid CSE",
      //           "code": "rgukt-cse"
      //         },
      //         {
      //           "name": "RGUKT Nuzivid 2000-03",
      //           "code": "rgukt-2000-03"
      //         },
      //         {
      //           "name": "RGUKT Nuzivid CSE 2000-03",
      //           "code": "211"
      //         }
      //       ]
      //     }
      //   ]
      // }
    ]
  }


}

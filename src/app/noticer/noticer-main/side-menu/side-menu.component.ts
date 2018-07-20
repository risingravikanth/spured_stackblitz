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

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  providers: [CustomValidator, MessageService],
  animations: [routerTransition()]
})
export class SideMenuComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder, private commonService: CommonService, private customValidator: CustomValidator) { }

  @ViewChild('myTopnav') el: ElementRef;

  public menuList: any = [];
  public isClassVisible = false;
  private toggleTopics: any;
  public isPosFix = true;
  public varShowSectionSettings = true;
  public varShowSectionOptions = false;
  public questionName: any = '';
  public selected: any;

  ngOnInit() {
    this.initTypes();

    this.commonService.toggleTopics.subscribe(toggelS => {
      this.isClassVisible = toggelS;
    });
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


  showAddCategoryDialog() {
    alert("add category");
  }
  showAddSectionDialog() {
    alert("add section");
  }


  selectedCategory(sec: any, cat: any) {
    let data = new Section();
    data.section = sec;
    data.category = cat;
    this.commonService.updateByFilter(data);
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
        "select":false,
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
                "name": "MAT",
                "code": "mat"
              },
              {
                "name": "GRE",
                "code": "toefl"
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
                "name": "Railways",
                "code": "railway"
              },
              {
                "name": "Banks",
                "code": "banks"
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
                "name": "TOEFL",
                "code": "toefl"
              },
              {
                "name": "IELTS",
                "code": "ielts"
              }
            ]
          }
        ]
      },
      {
        "title": "Boards",
        "select":false,
        "sections": [
          {
            "name": "Open",
            "code": "open",
            "categories": [
              {
                "name": "HOME",
                "code": "home"
              },
              {
                "name": "JNTU Kakinada",
                "code": "jntuk"
              },
              {
                "name": "RGUKT CSE 2000-03",
                "code": "1132"
              }
            ]
          },
          {
            "name": "Close",
            "code": "close",
            "categories": [
              {
                "name": "HOME",
                "code": "home"
              },
              {
                "name": "RGUKT Nuzivid",
                "code": "rgukt-nzv"
              },
              {
                "name": "RGUKT Nuzivid CSE",
                "code": "rgukt-cse"
              },
              {
                "name": "RGUKT Nuzivid 2000-03",
                "code": "rgukt-2000-03"
              },
              {
                "name": "RGUKT Nuzivid CSE 2000-03",
                "code": "211"
              }
            ]
          }
        ]
      }
    ]
  }


}

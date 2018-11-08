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
import { SECTIONS, BOARDS } from './../../../shared/master-data/master-data'
import { MobileDetectionService } from '../../../shared';
import { SideMenuService } from './side-menu.service';

@Component({
  selector: 'side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
  providers: [CustomValidator, MessageService, MobileDetectionService, SideMenuService],
  animations: [routerTransition()]
})
export class SideMenuComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder, 
    private commonService: CommonService,
     private customValidator: CustomValidator, 
     private modalService: NgbModal,
      private mobileService: MobileDetectionService, private service:SideMenuService) { }

  @ViewChild('myTopnav') el: ElementRef;

  public menuList: any = [];
  public boardsList: any = [];
  public isClassVisible = false;
  public isPosFix = true;
  public varShowSectionSettings = true;
  public varShowSectionOptions = false;
  public questionName: any = '';
  public selected: any;

  closeResult: string;
  public sectionModalReference: NgbModalRef;
  public categoryModalReference: NgbModalRef;
  public isMobile: boolean;
  ngOnInit() {
    this.menuList = SECTIONS;
    this.boardsList = BOARDS;
    this.isMobile = this.mobileService.isMobile();

    this.commonService.toggleTopics.subscribe(toggelS => {
      this.isClassVisible = toggelS;
    });

    // this.getFavBords();
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
    this.service.getAllStates().subscribe(
      resData =>{
        console.log(resData)
      }
    )
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

    if (this.isMobile) {
      this.commonService.updateHeaderMenu("noticer");
    }

    // this.commonService.updateByFilter(data);
    // if(sec && cat){
    //   this.router.navigate(['/feed'],
    //        {queryParams: {type: sec, category: cat}});
    // } else if(sec){
    //   this.router.navigate(['/feed'],
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

  getFavBords(){
    this.service.getFavBoards().subscribe(
      resData =>{
        console.log(resData);
      }
    )
  }

}

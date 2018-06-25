import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CustomValidator } from "../../../shared/others/custom.validator";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { DatePickerFormat } from '../../../shared/others/datepickerFormat';
import { VehicleOffRoadCreateService } from "./vehicle-offroad-create.service";
import { Observable } from "rxjs/Observable";
import { Reason, Aggregates, Categories, SubCategories } from "../../../shared/models/vehicle-offroad.model";
import { StringDecorator } from "../../../shared/others/string-decorator";
import { TimePickerFormat } from "../../../shared/others/timepickerFormat";
import {Message} from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { routerTransition } from '../../../router.animations';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-vehicle-offroad-create',
  templateUrl: './vehicle-offroad-create.component.html',
  styleUrls: ['./vehicle-offroad-create.component.css'],
   animations: [routerTransition(),
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])],
  providers: [VehicleOffRoadCreateService, CustomValidator, StringDecorator, MessageService]
})
export class VehicleOffRoadCreateComponent implements OnInit {

  constructor(private messageService: MessageService,private stringDecoratorService: StringDecorator, private datePickerService: DatePickerFormat,private timePickerService: TimePickerFormat, private cus_validator: CustomValidator, private vehicleService: VehicleOffRoadCreateService, private router: Router, private formbuilder: FormBuilder) { }

  vehicleOffRoadForm: FormGroup;
  vehicleOffRoadReasonDetailsForm: FormGroup;
  public showAggregates = false;

  public showAddNewAggregate = false;
  public showAddNewCategory = false;
  public showAddNewSubCategory = false;

  public filteredReasons: Reason[] = [];
  public filteredAggregates: Aggregates[] = [];
  public filteredCategories: Categories[] = [];
  public filteredSubCategories: SubCategories[] = [];

  public model: any;

  public showAggregatesTable = false;
  public listOfAddedReasons = [];
  public isDuplicateName = false;
  public count: number = 0;
  public totalCost: number = 0; 
  public valid = false;
  public validReason = false;

  // for response msg
  public responseData:any = { successResponse: "", failedResponse: "", cancel: "" }
  public showResponseSuccessMsg = false;
  public showResponseFailedMsg = false;

  public listOfAllDistricts: any = [];
  public listOfAllVehicles: any = [];
  public meridian = true;
  public emeDetails : any;
  public hourFormat: any;
  public maxMinDate: Date;
  public userDateFormat: string;

  msgs: Message[] = [];
  public showSpinner = false;
  public color = "primary";
  public mode = "indeterminate";
  
  ngOnInit() {
    this.initVehicleOffRoadForm();
    this.initVehicleOffRoadReasonDetailsForm();
    this.userDateFormat = this.datePickerService.getUserDateFormat();
    this.subscribeToFormChanges('reason');
    this.subscribeToFormChanges('aggregate');
    this.subscribeToFormChanges('category');
    this.subscribeToFormChanges('subcategory');
    // this.vehicleOffRoadForm.get('aggregateId').disable();

    let timeFormat = this.timePickerService.getTimeFormat();
    if(timeFormat == "12 Hours" || timeFormat == "12 hours"){
      this.hourFormat = "12";
    } else {
      this.hourFormat = "24"
    }

    this.getAllDistricts();

    this.maxMinDate = new Date();
    let today = new Date();
    this.maxMinDate.setDate(today.getDate());
  }
  isDisable = true;

  initVehicleOffRoadForm() {
    this.vehicleOffRoadForm = this.formbuilder.group({
      baseLocationVO: [],
      districtId: [-1, this.cus_validator.forbiddenNameValidator(/-1/i)],
      vehicleId: [-1, this.cus_validator.forbiddenNameValidator(/-1/i)],
      reasonId: [null, Validators.required],
      aggregateId: [null],
      categoryId: [null],
      subCategoryId: [null],
      cost:[""],
      reasonVO: this.formbuilder.group({
          id: [""],
          name: [""],
          aggregatesVO: this.formbuilder.group({
              id: [""],
              name: [""],
              reasonId: [""],
              categoriesVO: this.formbuilder.group({
                  id: [""],
                  name: [""],
                  aggregateId: [""],
                  subCategoriesVO: this.formbuilder.group({
                    id: [""],
                    name: [""],
                    cost: [""],
                    categoryId: [""]
                  })
              })
          })
      }),
      estimatedCost: ["", Validators.required],
      contactNumber: ["", Validators.compose([Validators.required, Validators.pattern('^[1-9][0-9]{9,10}$')])],
      odometerReading: ["", Validators.required],
      comments: ["", Validators.required],
      emeName: ["", Validators.required],
      emeId: ['', Validators.required],
      pilotName: [""],
      pilotId: [""],
      vehicleOffDate: ["", Validators.required],
      vehicleOffTime: [""],
      estimatedRecoveryDate: ["", Validators.required],
      estimatedRecoveryTime: [""],
      listOfReasons:[],
      finalReasonVO:[],
      offroadReasonDetails:[]
    });
  }

  initVehicleOffRoadReasonDetailsForm() {
    this.vehicleOffRoadReasonDetailsForm = this.formbuilder.group({
      reasonName:[""],
      aggregateName:[""],
      categoryName:[""],
      subCategoryName:[""],
      cost:[""]
    })
  }

  displayFn(data: any): string {
    return data ? data.name : data;
  }


  subscribeToFormChanges(fieldName: string) {

   if (fieldName == "reason") {
      const reasonChanges$ = this.vehicleOffRoadForm.controls['reasonId'].valueChanges;
      reasonChanges$.debounceTime(100).distinctUntilChanged().subscribe(value => {
        if (typeof value === "string") {
          this.vehicleService.searchReasons(value).subscribe(
            resData => {
              if (resData.length == 0) {
                this.filteredReasons = [];
                this.filteredReasons.push(new Reason(value));
              } else {
                this.filteredReasons = resData;
              }

            }
          )
        }
      })
    } else if (fieldName == "aggregate") {
      const aggregateChanges$ = this.vehicleOffRoadForm.controls['aggregateId'].valueChanges;
      aggregateChanges$.debounceTime(100).distinctUntilChanged().subscribe(value => {
        if (typeof value === "string") {
          let selectedReason: Reason = this.vehicleOffRoadForm.get('reasonId').value;
          if (selectedReason && selectedReason.id != undefined) {
            this.vehicleService.searchAggregates(selectedReason.id, value).subscribe(
              resData => {
                if (resData.length == 0) {
                  this.filteredAggregates = [];
                  this.filteredAggregates.push(new Aggregates(value));
                } else {
                  this.filteredAggregates = resData;
                }
              }
            )
          } else {
            this.filteredAggregates = [];
            this.filteredAggregates.push(new Aggregates(value));
          }
        }
      })
    }
    else if (fieldName == "category") {
      const categoryChanges$ = this.vehicleOffRoadForm.controls['categoryId'].valueChanges;
      categoryChanges$.debounceTime(100).distinctUntilChanged().subscribe(value => {
        if (typeof value === "string") {
          let selectedAggregate: Aggregates = this.vehicleOffRoadForm.get('aggregateId').value;
          if (selectedAggregate && selectedAggregate.id != undefined) {
            this.vehicleService.searchCategories(selectedAggregate.id, value).subscribe(
              resData => {
                if (resData.length == 0) {
                  this.filteredCategories = [];
                  this.filteredCategories.push(new Categories(value));
                } else {
                  this.filteredCategories = resData;
                }
              }
            )
          } else {
            this.filteredCategories = [];
            this.filteredCategories.push(new Categories(value));
          }
        }
      })
    }
    else if (fieldName == "subcategory") {
      const subCategoryChanges$ = this.vehicleOffRoadForm.controls['subCategoryId'].valueChanges;
      subCategoryChanges$.debounceTime(100).distinctUntilChanged().subscribe(value => {
        if (typeof value === "string") {
          let selectedCategory: Categories = this.vehicleOffRoadForm.get('categoryId').value;
          if (selectedCategory && selectedCategory.id != undefined) {
            this.vehicleService.searchSubCategories(selectedCategory.id, value).subscribe(
              resData => {
                if (resData.length == 0) {
                  this.filteredSubCategories = [];
                  this.filteredSubCategories.push(new SubCategories(value));
                } else {
                  this.filteredSubCategories = resData;
                }
              }
            )
          } else {
            this.filteredSubCategories = [];
            this.filteredSubCategories.push(new SubCategories(value));
          }
        }
      })
    }
  }


  getCost(selectedSubCategory){
      this.vehicleOffRoadForm.controls['cost'].patchValue(selectedSubCategory.cost)
  }

  addRow(){

    let selectedReason: Reason = this.vehicleOffRoadForm.get('reasonId').value;
    let selectedAggregate: Aggregates = this.vehicleOffRoadForm.get('aggregateId').value;
    let selectedCategory: Categories = this.vehicleOffRoadForm.get('categoryId').value;
    let selectedSubCategory: SubCategories = this.vehicleOffRoadForm.get('subCategoryId').value;
    let cost = this.vehicleOffRoadForm.get('cost').value;

    this.vehicleOffRoadForm.get('reasonVO').get('id').patchValue(selectedReason.id);
    this.vehicleOffRoadForm.get('reasonVO.aggregatesVO').get('id').patchValue(selectedAggregate.id);
    this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO').get('id').patchValue(selectedCategory.id);
    this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('id').patchValue(selectedSubCategory.id);
    
    if(selectedReason.name != undefined){
      this.vehicleOffRoadForm.get('reasonVO').get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedReason.name.trim()));
    } else{
      this.vehicleOffRoadForm.get('reasonVO').get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedReason));
    }

    if(selectedAggregate.name != undefined){
      this.vehicleOffRoadForm.get('reasonVO.aggregatesVO').get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedAggregate.name.trim()));
    } else{
      this.vehicleOffRoadForm.get('reasonVO.aggregatesVO').get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedAggregate));
    }

    if(selectedCategory.name != undefined){
      this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO').get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedCategory.name.trim()));
    } else{
      this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO').get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedCategory));
    }

    if(selectedSubCategory.name != undefined){
      this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedSubCategory.name.trim()));
      this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('cost').patchValue(cost);

    } else{
      this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedSubCategory));
      this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('cost').patchValue(cost);
    }


        this.valid = true;
    if (this.valid) {
      this.valid = false;


        if(this.isDuplicateName == false){
          this.listOfAddedReasons.push(this.vehicleOffRoadForm.controls['reasonVO'].value);
            this.totalCost = this.totalCost + this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('cost').value;
            this.vehicleOffRoadForm.controls['estimatedCost'].patchValue(this.totalCost);
            this.count = this.count + 1;
          this.reset();
            if(this.listOfAddedReasons.length > 0){
              this.validReason = true;
              this.showAggregatesTable = true;
            }
        }
    }
  }

  deleteReason(index) {
    this.count = this.count - 1;
    this.listOfAddedReasons.splice(this.listOfAddedReasons.indexOf(index), 1);
    this.totalCost = this.totalCost - index.aggregatesVO.categoriesVO.subCategoriesVO.cost;
    this.vehicleOffRoadForm.controls['estimatedCost'].patchValue(this.totalCost);
    if (this.count == 0) {
        this.showAggregatesTable = false;
        this.validReason = false;
        this.filteredReasons = [];
    }
  }

  reset(){
    this.initVehicleOffRoadForm();
    this.initVehicleOffRoadReasonDetailsForm();
    this.filteredAggregates = [];
    this.filteredCategories = [];
    this.filteredSubCategories = [];

    this.vehicleOffRoadForm.get('reasonVO.aggregatesVO').get('id').patchValue("");
    this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO').get('id').patchValue("");
    this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('id').patchValue("");

    this.vehicleOffRoadForm.get('reasonVO.aggregatesVO').get('name').patchValue("");
    this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO').get('name').patchValue("");
    this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('name').patchValue("");
    this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('cost').patchValue("");

    this.vehicleOffRoadForm.get('aggregateId').patchValue("");
    this.vehicleOffRoadForm.get('categoryId').patchValue("");
    this.vehicleOffRoadForm.get('subCategoryId').patchValue("");
    this.vehicleOffRoadForm.get('cost').patchValue("");

  }

  getDate(millis): Date {
        let date = new Date(millis);
        return millis ? new Date(millis) : null;
    }

  saveVehicleOffRoad(){
    this.showSpinner = true;
    if(this.listOfAddedReasons.length == 0){
      let list = [];
      let selectedReason = this.vehicleOffRoadForm.get('reasonId').value;
      if(selectedReason && selectedReason.id == undefined){
        if(selectedReason.name != undefined){
              this.vehicleOffRoadForm.controls['reasonVO'].get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedReason.name));
        } else{
            this.vehicleOffRoadForm.controls['reasonVO'].get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedReason));
        }
        this.vehicleOffRoadForm.get('reasonVO.aggregatesVO').get('name').patchValue(null);
        this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO').get('name').patchValue(null);
        this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('name').patchValue(null);
        list.push(this.vehicleOffRoadForm.controls['reasonVO'].value);
      } else{
        this.vehicleOffRoadForm.controls['reasonVO'].get('id').patchValue(selectedReason.id);
        this.vehicleOffRoadForm.controls['reasonVO'].get('name').patchValue(this.stringDecoratorService.stringUnifromity(selectedReason.name));
        this.vehicleOffRoadForm.get('reasonVO.aggregatesVO').get('name').patchValue(null);
        this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO').get('name').patchValue(null);
        this.vehicleOffRoadForm.get('reasonVO.aggregatesVO.categoriesVO.subCategoriesVO').get('name').patchValue(null);
        list.push(this.vehicleOffRoadForm.controls['reasonVO'].value);
      }
      this.vehicleOffRoadForm.controls['listOfReasons'].patchValue(list);
    } else{
      this.vehicleOffRoadForm.controls['listOfReasons'].patchValue(this.listOfAddedReasons);
    }

    let finalListOfReasons = this.vehicleOffRoadForm.controls['listOfReasons'].value;


  let groups = {};
  let listOfGroupdAggregates = [];
  let groupOfCategories = {};

  // grouping of aggregates
  for (var i = 0; i < finalListOfReasons.length; i++) {
      var groupName = finalListOfReasons[i].aggregatesVO.name;
      var groupId = finalListOfReasons[i].aggregatesVO.id;
      if (!groups[groupName]) {
        groups[groupName] = [];
        groups[groupName].aggregatesVO = {name:String, id: Number, listOfCategories:[]}
        groups[groupName].aggregatesVO.name = groupName;
        groups[groupName].aggregatesVO.id = groupId;
        
      }
      groups[groupName].aggregatesVO.listOfCategories.push(finalListOfReasons[i].aggregatesVO.categoriesVO);
  }

  for(let i in groups){
    listOfGroupdAggregates.push(groups[i]);
  }


  // grouping of categories and sub categories
  for(let m in listOfGroupdAggregates){
    for(let k in listOfGroupdAggregates[m].aggregatesVO.listOfCategories){
      var groupName = listOfGroupdAggregates[m].aggregatesVO.listOfCategories[k].name;
      var groupId = listOfGroupdAggregates[m].aggregatesVO.listOfCategories[k].id;
      if (!groupOfCategories[groupName]) {
            groupOfCategories[groupName] = [];
            groupOfCategories[groupName].categoriesVO = {name:String, id: Number, listOfSubCategories:[]}
            groupOfCategories[groupName].categoriesVO.name = groupName;
            groupOfCategories[groupName].categoriesVO.id = groupId;
      }
           groupOfCategories[groupName].categoriesVO.listOfSubCategories.push(listOfGroupdAggregates[m].aggregatesVO.listOfCategories[k].subCategoriesVO);
    }
      let list = [];
      for(let l in  groupOfCategories){
          list.push(groupOfCategories[l].categoriesVO);
      }
    listOfGroupdAggregates[m].aggregatesVO.listOfCategories = list;
    groupOfCategories = {};
  }

let customReasonVO =  { name:String, 
                      id: Number, 
                      listOfAggregates:[]
                    }
  
customReasonVO.id = finalListOfReasons[0].id;
customReasonVO.name =  finalListOfReasons[0].name;

for(let i in listOfGroupdAggregates){
  customReasonVO.listOfAggregates.push(listOfGroupdAggregates[i].aggregatesVO);
}

this.vehicleOffRoadForm.controls['finalReasonVO'].patchValue(customReasonVO);


let listOfReasonDetails = [];
for(let item in finalListOfReasons){
  this.vehicleOffRoadReasonDetailsForm.controls["reasonName"].patchValue(finalListOfReasons[item].name);
  this.vehicleOffRoadReasonDetailsForm.controls["aggregateName"].patchValue(finalListOfReasons[item].aggregatesVO.name);
  this.vehicleOffRoadReasonDetailsForm.controls["categoryName"].patchValue(finalListOfReasons[item].aggregatesVO.categoriesVO.name);
  this.vehicleOffRoadReasonDetailsForm.controls["subCategoryName"].patchValue(finalListOfReasons[item].aggregatesVO.categoriesVO.subCategoriesVO.name);
  this.vehicleOffRoadReasonDetailsForm.controls["cost"].patchValue(finalListOfReasons[item].aggregatesVO.categoriesVO.subCategoriesVO.cost);
  listOfReasonDetails.push(this.vehicleOffRoadReasonDetailsForm.value)
}

this.vehicleOffRoadForm.controls['offroadReasonDetails'].patchValue(listOfReasonDetails);

if(this.listOfAddedReasons.length == 0){
  this.vehicleOffRoadForm.controls['finalReasonVO'].value.listOfAggregates = null;
}

if(this.hourFormat == "12"){
      let localOffDateTime = this.vehicleOffRoadForm.get("vehicleOffDate").value;
      var index = localOffDateTime.indexOf(" "); 
      var date = localOffDateTime.substr(0, index);
      var time = localOffDateTime.substr(index + 1);
      this.vehicleOffRoadForm.get("vehicleOffTime").patchValue(date + " " +this.convertTime12HrsFormatTo24Hrs(time));

      let localExpectedDateTime = this.vehicleOffRoadForm.get("estimatedRecoveryDate").value;
      var index = localExpectedDateTime.indexOf(" ");
      var date = localExpectedDateTime.substr(0, index);
      var time = localExpectedDateTime.substr(index + 1);
      this.vehicleOffRoadForm.get("estimatedRecoveryTime").patchValue(date + " " +this.convertTime12HrsFormatTo24Hrs(time));
} else{
  this.vehicleOffRoadForm.get("vehicleOffTime").patchValue(this.vehicleOffRoadForm.get("vehicleOffDate").value);
  this.vehicleOffRoadForm.get("estimatedRecoveryTime").patchValue(this.vehicleOffRoadForm.get("estimatedRecoveryDate").value);
}

this.vehicleService.saveVehicleOffRoad(this.vehicleOffRoadForm.value).subscribe(
  resData => {
    this.responseData = resData;
    this.showSpinner = false;
    if (this.responseData.successResponse) {
          this.initVehicleOffRoadForm();
          this.initVehicleOffRoadReasonDetailsForm();
          this.ngOnInit();
          this.reset();
          this.filteredReasons = [];
          this.listOfAddedReasons = [];
          this.msgs = [];
          this.msgs.push({severity:'success', summary:'Success:', detail:this.responseData.successResponse});
        }
        if (this.responseData.failedResponse) {
          this.msgs = [];
          this.msgs.push({severity:'error', summary:'Failed:', detail:this.responseData.failedResponse});
        }
  }
)
}


// TODO: Changes required....
// based on state - get all vehicles 
//based on district - vehicles list 
getAllDistricts(){
this.vehicleService.getDist(1).subscribe(
  resData => {
    this.listOfAllDistricts = resData;
  }
)
}


getVehiclesByDistrict(value){
  this.vehicleService.getVehiclesByDistrict(value).subscribe(
    resData => {
      this.listOfAllVehicles = resData;
    }
  )
}

getEmeByVehicle(value){
  this.vehicleService.getEMEForVehicle(value).subscribe(
    resData => {
      this.emeDetails = resData;
      if(this.emeDetails){
        this.vehicleOffRoadForm.controls["emeName"].patchValue(this.emeDetails.firstName + " " + this.emeDetails.lastName)
        this.vehicleOffRoadForm.controls["emeId"].patchValue(this.emeDetails.id)
      }
    }
  ) 
}

convertTime12HrsFormatTo24Hrs(time){
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if(AMPM == "PM" && hours<12) hours = hours+12;
    if(AMPM == "AM" && hours==12) hours = hours-12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if(hours<10) sHours = "0" + sHours;
    if(minutes<10) sMinutes = "0" + sMinutes;

    return (sHours + ":" + sMinutes);
    }


}

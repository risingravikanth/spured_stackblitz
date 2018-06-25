import { Component, OnInit, Inject } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CustomValidator } from "../../../shared/others/custom.validator";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { AutoCompleteService } from '../../../shared/index';
import { VehicleOffRoadCreateService } from "../vehicle-offroad-create/vehicle-offroad-create.service";
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-vehicle-offroad-list',
  templateUrl: './vehicle-offroad-list.component.html',
  styleUrls: ['./vehicle-offroad-list.component.css'],
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
  providers:[CustomValidator, VehicleOffRoadCreateService]
})

export class VehicleOffRoadListComponent implements OnInit {

  constructor(public dialog: MatDialog,  private router: Router, private formbuilder: FormBuilder, private service: VehicleOffRoadCreateService ) { }

   public noRecordFound = false;

  // pagination & tavle
  page = 1;
  public pageValue: any
  public showTable = false;
  public listOfOffRoadVehicles: any = [];
  public listOfReasons: any = [];
  public showSpinner = false;
  public color = "primary";
  public mode = "indeterminate";

  ngOnInit() {
    this.getAllOffRoadVehicles();
  }

  getAllOffRoadVehicles(){
    this.showSpinner = true;
    this.pageValue = this.page - 1;
    this.service.getAllOffRoadVehicles(this.pageValue).subscribe(
      resData =>{
        this.showSpinner = false;
          this.listOfOffRoadVehicles = resData;
          if(this.listOfOffRoadVehicles.content.length != 0){
            this.showTable = true;
            this.noRecordFound = false;
          } else{
            this.showTable = false;
            this.noRecordFound = true;
          }
      }
    )
  }

  showOffRoadReasons(id: any){
    
    this.service.getOffRoadReasons(id).subscribe( 
      resData => {
        this.listOfReasons = resData;
        if (this.listOfReasons.length != 0) {
        let dialogRef = this.dialog.open(OffRoadReasonsShowingDialog, {
          disableClose: true,
          width: '800px',
          data: { reasonDetails: this.listOfReasons, disable: false }
        });
    }
      }
    )
    
  }
 

}


@Component({
  selector: 'vehicle-offroad-showing-dialog.html',
  templateUrl: 'vehicle-offroad-showing-dialog.html',
})
export class OffRoadReasonsShowingDialog {

  constructor(
    public dialogRef: MatDialogRef<OffRoadReasonsShowingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  public user: any = [];
  onNoClick(): void {
    this.dialogRef.close();
  }
}
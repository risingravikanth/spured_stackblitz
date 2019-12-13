import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.scss']
})
export class CreatePostDialogComponent implements OnInit {

  public createPostDialogData :any;
  public postType :any =  "Private";
  typeControl = new FormControl();
  filteredOptions: Observable<any[]>;

  constructor(private dialogRef: MatDialogRef<CreatePostDialogComponent>,
  @Inject(MAT_DIALOG_DATA) data) {

    this.createPostDialogData = data;
  }
  
  ngOnInit() {
    this.filteredOptions = this.typeControl.valueChanges
      .pipe(
        startWith(''),
        map((value:any) => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filter(label) : this.createPostDialogData.data.types.slice())
      );
  }

  displayFn(type?: any): string | undefined {
    return type ? type.label : undefined;
  }

  private _filter(label: string): any[] {
    const filterValue = label.toLowerCase();

    return this.createPostDialogData.data.types.filter(type => type.label.toLowerCase().indexOf(filterValue) === 0);
  }

  changePostType(type :any) {
    this.postType = type;
  }
  
  onCancel() {
    this.dialogRef.close(null);
  }
 
}

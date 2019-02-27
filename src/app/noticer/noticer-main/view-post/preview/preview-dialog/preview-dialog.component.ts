import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit {

  fileUrl  :string;
  isDownloaded : boolean = false;

  constructor(private dialogRef: MatDialogRef<PreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    	this.fileUrl = data.fileUrl;
      let checkFileExtention = this.fileUrl.changingThisBreaksApplicationSecurity;
      if(checkFileExtention.indexOf('.doc') !== -1 || checkFileExtention.indexOf('.docx') !== -1 ||
         checkFileExtention.indexOf('.xlsx') !== -1 || checkFileExtention.indexOf('.xls') !== -1  ){
         this.isDownloaded = true;
      }

  }

  onCancel() {
     this.dialogRef.close(null);
  }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

 import { PreviewDialogComponent } from './preview-dialog/preview-dialog.component';


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {

  
  @Input() files : any;
  @Input() images : any;
  @Input() _type :any;
  @Input() _id : any;

  private dialogRef;
  public fileUrl : any = "";
 
  constructor(
   private sanitizer : DomSanitizer,
   private dialog: MatDialog,
   private modalService: NgbModal) { }

  ngOnInit() {
   
  }

  imageFromAws(url) {
    return url.indexOf("https://") != -1 ? true : false;
  }

  getSanitizeURL(url){
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  previewFile(content,url) {
    /* NOTE :: Angular meterial dialog */
    let dialogFilePreviewConfig = new MatDialogConfig();
    const data = {
      name: "File Preview",
      fileUrl: this.getSanitizeURL(url)
    };


    dialogFilePreviewConfig.data = data;
    dialogFilePreviewConfig.width = '1100px';
    //dialogFilePreviewConfig.max-width = '95vw';
   
    //dialogFilePreviewConfig.height = '650px';
    
    const dialogRef = this.dialog.open(PreviewDialogComponent, dialogFilePreviewConfig);
    
    /* NOTE :: Angular meterial dialog */
    /*this.fileUrl = this.getSanitizeURL(url);
    if(this.fileUrl && this.fileUrl != ""){
      this.dialogRef = this.modalService.open(content, { size: 'lg' });
    }*/
 }

  
 
}

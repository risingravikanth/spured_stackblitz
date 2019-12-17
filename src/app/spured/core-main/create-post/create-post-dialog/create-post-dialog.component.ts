import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from '../../../../shared/services/Toastr.service';
import * as categories_types_models from '../../../../shared/master-data/master-data';

@Component({
  selector: 'app-create-post-dialog',
  templateUrl: './create-post-dialog.component.html',
  styleUrls: ['./create-post-dialog.component.scss'],
  providers: [ToastrService]
})
export class CreatePostDialogComponent implements OnInit {

  public createPostDialogData :any;
  public postType :any =  "Private";
  public currentSelectedCategory :any;= [];
  public selectedModels :any 
  typeControl = new FormControl();
  categoryControl = new FormControl();
  modelControl = new FormControl();

  filteredTypes: Observable<any[]>;
  filteredCategories: Observable<any[]>;
  filteredModels: Observable<any[]>;

  public formData :any = {
    heading:"",
    selectedOption : "post",
    postDescription : "",
    questionDescription : "",
    multipleOption :{
      option1:"",
      option2:"",
      option3:"",
      option4:"",
      answer: ""
    },
    videoLink : "",
    docuemntLink : "",
    pdfLink : "",
    urls: [],
    postImages :[]
  };

  constructor(private dialogRef: MatDialogRef<CreatePostDialogComponent>,
  @Inject(MAT_DIALOG_DATA) data,
  private toastr: ToastrService) {

    this.createPostDialogData = data;
  }
  
  ngOnInit() {
    this.filteredTypes = this.typeControl.valueChanges
      .pipe(
        startWith(''),
        map((value:any) => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filterType(label) : this.createPostDialogData.data.types.slice())
      );

    this.filteredCategories = this.categoryControl.valueChanges
      .pipe(
        startWith(''),
        map((value:any) => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filterCategory(label) : this.createPostDialogData.data.categories.slice())
      );

    this.filteredModels = this.modelControl.valueChanges
      .pipe(
        startWith(''),
        map((value:any) => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filterModel(label) : this.createPostDialogData.data.models.slice())
      );
  }

  displayType(type?: any): string | undefined {
    return type ? type.label : undefined;
  }

  displayCategory(type?: any): string | undefined {
    return type ? type.label : undefined;
  }

  displayModel(type?: any): string | undefined {
    return type ? type.label : undefined;
  }

  private _filterType(label: string): any[] {
    const filterValue = label.toLowerCase();
    return this.createPostDialogData.data.types.filter(type => type.label.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterCategory(label: string): any[] {
    const filterValue = label.toLowerCase();
    return this.createPostDialogData.data.categories.filter(category => category.label.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterModel(label: string): any[] {
    const filterValue = label.toLowerCase();
    return this.createPostDialogData.data.models.filter(model => model.label.toLowerCase().indexOf(filterValue) === 0);
  }

  changePostType(type :any) {
    this.postType = type;
  }

  getCategoriesByType(type) {
    let categoriesByType :any = [];
    categories_types_models.SECTIONS.forEach(section => {
      if (section.title == "Topics") {
        section.sections.forEach((item:any) => {
          if (item.code.toUpperCase() == type.value.toUpperCase()) {
            this.currentSelectedCategory = item;
            item.categories.forEach((category :any) => {
              if (category.name != "Home") {
                let categoryObj = { label: category.name, value: category.code };
                categoriesByType.push(categoryObj);
              }
            })
          }
        })
      }
    });

    this.filteredCategories = this.categoryControl.valueChanges
      .pipe(
        startWith(''),
        map((value:any) => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filterCategory(label) : categoriesByType.slice())
      );
    
  }
  
  getmodelsByCategory(selectedCategory){
    let modelsbyCategory :any = [];
    if(this.currentSelectedCategory!== undefined){
      if(this.currentSelectedCategory.modelsbyCategory !== undefined && this.currentSelectedCategory.modelsbyCategory === "true" ){
        this.currentSelectedCategory.categories.forEach(category => {
            if (category.code.toUpperCase() == selectedCategory.value.toUpperCase()) {
              modelsbyCategory = (category.models !== undefined) ? category.models : this.selectedModels;
            }
          });

          this.filteredModels = this.modelControl.valueChanges
            .pipe(
              startWith(''),
              map((value:any) => typeof value === 'string' ? value : value.label),
              map(label => label ? this._filterModel(label) : modelsbyCategory.slice())
            ); 
      }else{
          this.setModels(this.currentSelectedCategory.code);
      }
    }
  }

  setModels(type) {
    let modelsbyCategory :any = [];
    type= type.toUpperCase();
    categories_types_models.MODELS.forEach(item => {
      let type_search = (type == "VERBAL" || type == "QUANTS" || type == "DI") ? "VERBAL" : type;
      if (item.type == type_search) {
        modelsbyCategory = item.models;
        this.selectedModels = modelsbyCategory;
      }
    });

    this.filteredModels = this.modelControl.valueChanges
      .pipe(
        startWith(''),
        map((value:any) => typeof value === 'string' ? value : value.label),
        map(label => label ? this._filterModel(label) : modelsbyCategory.slice())
      );
  }


  detectFiles(event) {
    let files = event.target.files;
    if (files.length > 4 || (this.formData.urls.length + files.length) > 4) {
      this.toastr.error("Failed", "Only 4 images allowed");
    } else if (files) {
      for (let file of files) {
        let reader = new FileReader();
        let found = [];


        reader.onload = (function(f,urls,found) {

            return function(e) {
                // Here you can use `e.target.result` or `this.result`
                // and `f.name`.
                found = urls.filter(item => function(){
                            if(item && item.preview){
                                item.preview == e.target.result;
                            }
                });
                if(found.length == 0) {
                    f["preview"] = this.result;
                    urls.push(f);
                }
              };
        })(file,this.formData.urls,found);

        if(  file.type === "image/gif" ||
              file.type === "image/jpeg" || 
              file.type === "image/jpg"|| 
              file.type === "image/png" ){

              reader.readAsDataURL(file);
      
        }else if( file.type === "text/plain" ||
              file.type === "application/pdf"){
            
              this.formData.urls.push(file);
        }else{
            if(file.name){
              if(file.name.indexOf('.doc') !== -1){
                  file.fileType = "application/doc";
              }else if(file.name.indexOf('.docx') !== -1){
                  file.fileType = "application/doc";
              }else if(file.name.indexOf('.ppt') !== -1){
                  file.fileType = "application/ppt";
              }else if(file.name.indexOf('.pptx') !== -1){
                  file.fileType = "application/ppt";
              }else if(file.name.indexOf('.xls') !== -1){
                  file.fileType = "application/xls";
              }else if(file.name.indexOf('.xlsx') !== -1){
                  file.fileType = "application/xls";
              }

            }
            
            this.formData.urls.push(file);
        }
      
        if (found.length == 0) {
          this.formData.postImages.push(file);
        }
      }
    }
  }

  removeFromImages(index) {
    this.formData.urls.splice(index, 1);
    this.formData.postImages.splice(index, 1);
  }

  
  onCancel() {
    this.dialogRef.close(null);
  }
 
}

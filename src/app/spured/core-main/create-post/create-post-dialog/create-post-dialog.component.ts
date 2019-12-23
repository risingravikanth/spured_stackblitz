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
  public currentSelectedCategory :any = [];
  public selectedModels :any 
  typeControl = new FormControl();
  categoryControl = new FormControl();
  modelControl = new FormControl();

  filteredTypes: Observable<any[]>;
  filteredCategories: Observable<any[]>;
  filteredModels: Observable<any[]>;
  
  postHeadingPlaceHolder :any = "Give some heading to your post...";
  postDescriptionPlaceHolder :any = "Give detailed description about your post...";

  public formData :any = {
    heading:"",
	_type: "",
	_category:"",
	_model:"",
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
    enableUpload: false,
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
        map((value:any) => (typeof value === 'string' && value !== null) ? value : value.label),
        map(label => label ? this._filter(label,this.createPostDialogData.data.types) : this.createPostDialogData.data.types.slice())
      );

    this.filteredCategories = this.categoryControl.valueChanges
      .pipe(
        startWith(''),
        map((value:any) => (typeof value === 'string' && value !== null) ? value : value.label),
        map(label => label ? this._filter(label,this.createPostDialogData.data.categories) : this.createPostDialogData.data.categories.slice())
      );
	
	if(this.createPostDialogData.data._type !== "" && this.createPostDialogData.data._type !== undefined){
		this.formData._type = this.createPostDialogData.data._type;
		this.typeControl.patchValue({label: this.formData._type.replace("_"," "), name:this.formData._type});
		this.typeControl.disable();
	}
	
	if(this.createPostDialogData.data._category !== "" && this.createPostDialogData.data._category !== undefined){
		this.formData._category = this.createPostDialogData.data._category;
		this.categoryControl.patchValue({label: this.formData._category.toUpperCase().replace("_"," "), name:this.formData._category});
		this.categoryControl.disable();
	}
	
	if(this.createPostDialogData.data.requestType !== "BOARD" && this.createPostDialogData.data.requestType !== "GROUP"){
		this.postType = "Public";
	}
	 
  }

  displayLabel(type?: any): string | undefined {
    return type ? type.label : undefined;
  }

  private _filter(label: string, inputArray :any): any[] {
    const filterValue = label.toLowerCase();
    return inputArray.filter((type :any) => type.label.toLowerCase().indexOf(filterValue) === 0);
  }

  changePostType(type :any) {
    this.postType = type;
  }
  
  changePlaceHolder(newValue :any){
    if(newValue === "post"){
      this.postHeadingPlaceHolder  = "Give some heading to your post...";
      this.postDescriptionPlaceHolder = "Give detailed description about your post...";
    }else if(newValue === "mcq"){
      this.postHeadingPlaceHolder  = "Add your question here...";
    }else if(newValue === "event"){
      this.postHeadingPlaceHolder  = "Give some heading to your event...";
	  this.postHeadingPlaceHolder  = "Give some description about your event...";
    }
  }

  getCategoriesByType(type) {
    let categoriesByType :any = [];
    this.categoryControl.patchValue(null);
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
        map(label => label ? this._filter(label,categoriesByType) : categoriesByType.slice())
      );
    
  }
  
  getmodelsByCategory(selectedCategory){
    let modelsbyCategory :any = [];
    this.modelControl.patchValue(null);
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
              map(label => label ? this._filter(label,modelsbyCategory) : modelsbyCategory.slice())
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
        map(label => label ? this._filter(label,modelsbyCategory) : modelsbyCategory.slice())
      );
  }
  
  handelMultipleFiles(e,file,found){
		// Here you can use `e.target.result` or `this.result`
		// and `f.name`.
		found = this.formData.urls.filter(item => function(){
				   if(item && item.preview){
						item.preview == e.target.result;
					}
		});
		//if(found.length == 0) {
		   file["preview"] = e.target.result;;
		   this.formData.urls.push(file);
		//}
   }


  detectFiles(event) {
    let files = event.target.files;
    if (files.length > 4 || (this.formData.urls.length + files.length) > 4) {
      this.toastr.error("Failed", "Only 4 images allowed");
    } else if (files) {
      for(var i=0 ; i< files.length; i++){
		let file = files[i];
        let reader = new FileReader();
        let found = [];


        let self = this;
		reader.onload = function (e) {
			self.handelMultipleFiles(e,file,found);
		}

        if(file.type === "image/gif" ||
              file.type === "image/jpeg" || 
              file.type === "image/jpg"|| 
              file.type === "image/png"){

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

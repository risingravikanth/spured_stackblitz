import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  public currentSelectedCategory :any = [];
  public selectedModels :any 
 
  filteredTypes: Observable<any[]>;
  filteredCategories: Observable<any[]>;
  filteredModels: Observable<any[]>;
  
  postHeadingPlaceHolder :any = "Give some heading to your post...";
  postDescriptionPlaceHolder :any = "Give detailed description about your post...";
    
  onPost :any = new EventEmitter();
     
  createForm: FormGroup;
  typeControl= new FormControl('', [Validators.required]);
  categoryControl= new FormControl('', [Validators.required]);
  modelControl= new FormControl('', [Validators.required]);
     
  public formData :any = {
    heading:"",
	_type: "",
	_category:"",
	_model:"",
    selectedOption : "post",
	postType: "Private",
    description : "",
    multipleOption :{
      option1:"",
      option2:"",
      option3:"",
      option4:"",
      answer: ""
    },
	event:{
	 fromDate:"",
	 toDate:"",
	 contacts:"",
	 website:"",
	 location:""
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
  
  initForm() {
	  this.createForm = new FormGroup({
		  postTypeControl: new FormControl()
	  });
/*	  this.createForm = new FormGroup({
		  typeCtrl: new FormControl('', [Validators.required]),
		  categoryCtrl: new FormControl('', [Validators.required]),
		  modelCtrl: new FormControl('', [Validators.required]),
	  });*/
  }
  
  setAutocompleteValue(fieldName){
	  switch(fieldName){
		  case "type": {
			typeof(this.formData._type) === "object" ? this.typeControl.patchValue(this.formData._type)
				: this.typeControl.patchValue({label: this.formData._type.replace("_"," "), name:this.formData._type});
			//this.createForm.controls.typeCtrl.patchValue(this.typeControl.value);
			break;
		  }
		  case "category": {
		 	typeof(this.formData._category) === "object" ? this.categoryControl.patchValue(this.formData._category)
				: this.categoryControl.patchValue({label: this.formData._category.toUpperCase().replace("_"," "), name:this.formData._category});
		 	//this.createForm.controls.categoryCtrl.patchValue(this.categoryControl.value);
			break;
		  }
	 	  case "model": {
			typeof(this.formData._model) === "object" ? this.modelControl.patchValue(this.formData._model)
				: this.modelControl.patchValue({label: this.formData._model.toUpperCase().replace("_"," "), name:this.formData._model});
			//this.createForm.controls.modelCtrl.patchValue(this.modelControl.value);
			break;
		  }
		  default: {
			break;  
		  }
	}
  }
  
  ngOnInit() {
	this.initForm();
    this.filteredTypes = this.typeControl.valueChanges
      .pipe(
        startWith(''),
        map((value:any) => (typeof value === 'string' || value == null) ? value : value.label),
        map(label => label ? this._filter(label,this.createPostDialogData.data.types) : this.createPostDialogData.data.types.slice())
      );

    this.filteredCategories = this.categoryControl.valueChanges
      .pipe(
        startWith(''),
        map((value:any) => (typeof value === 'string' || value == null) ? value : value.label),
        map(label => label ? this._filter(label,this.createPostDialogData.data.categories) : this.createPostDialogData.data.categories.slice())
      );
	
	if(this.createPostDialogData.data._type !== "" && this.createPostDialogData.data._type !== undefined){
		this.formData._type = this.createPostDialogData.data._type;
		this.setAutocompleteValue("type");
		this.typeControl.disable();
	}
	
	if(this.createPostDialogData.data._category !== "" && this.createPostDialogData.data._category !== undefined){
		this.setModels(this.createPostDialogData.data._type);
		if(this.createPostDialogData.data._category !== "home" && this.createPostDialogData.data._category !== "HOME"){
			this.formData._category = this.createPostDialogData.data._category;
			this.setAutocompleteValue("category");
			this.categoryControl.disable();
			this.setModels(this.createPostDialogData.data._type);
		}
	}
	
	if(this.createPostDialogData.data.requestType !== "BOARD" && this.createPostDialogData.data.requestType !== "GROUP"){
		this.formData.postType = "Public";
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
    this.formData.postType = type;
  }
  
  changePlaceHolder(newValue :any){
    if(newValue === "post"){
      this.postHeadingPlaceHolder  = "Give some heading to your post...";
      this.postDescriptionPlaceHolder = "Give detailed description about your post...";
    }else if(newValue === "mcq"){
      this.postHeadingPlaceHolder  = "Add your question here...";
    }else if(newValue === "event"){
      this.postHeadingPlaceHolder  = "Give some heading to your event...";
	  this.postDescriptionPlaceHolder  = "Give some description about your event...";
    }
  }

  getCategoriesByType(type) {
    let categoriesByType :any = [];
    this.categoryControl.patchValue(null);
	//this.createForm.controls.categoryCtrl.patchValue(null);
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
        map((value:any) => (typeof value === 'string' || value == null) ? value : value.label),
        map(label => label ? this._filter(label,categoriesByType) : categoriesByType.slice())
      );
    this.formData._type = type;
	this.setAutocompleteValue("type");
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
              map((value:any) => (typeof value === 'string' || value == null) ? value : value.label),
              map(label => label ? this._filter(label,modelsbyCategory) : modelsbyCategory.slice())
            ); 
      }else{
          this.setModels(this.currentSelectedCategory.code);
      }
	  this.formData._category = selectedCategory;
	  this.setAutocompleteValue("category");
    }
  }
  
  setFormDataModel(selectedModel){
	this.formData._model = selectedModel;  
	this.setAutocompleteValue("model");
  }

  setModels(type) {
    let modelsbyCategory :any = [];
	if(type === undefined) return [];
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
        map((value:any) => (typeof value === 'string' || value == null) ? value : value.label),
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
               if(file.name.indexOf('.doc') !== -1 || file.name.indexOf('.docx') !== -1){
                 file.fileType = "application/doc";
              }else if(file.name.indexOf('.ppt') !== -1 || file.name.indexOf('.pptx') !== -1){
                 file.fileType = "application/ppt";
              }else if(file.name.indexOf('.xls') !== -1 || file.name.indexOf('.xlsx') !== -1){
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
  
  getErrorMessage() {
    return this.typeControl.hasError('required') ? 'You must select a value' : '';
  }
  
  onPostClick() {
 	  if(this.formData.postType == "Public"){
		  if(this.formData._type === "" || this.formData._category == "" || this.formData._model == "")
			return; 
		  if(this.formData.heading == "")
			return;
	   }else {
		 if(this.formData.heading == "")
			return;
		 if(this.formData.postDescription == ""){
			this.formData.postDescription = " "; 
		 }
		  
	  }
 	  this.onPost.emit(this.formData);
  }

  
  onCancel() {
    this.dialogRef.close(null);
  }
 
}

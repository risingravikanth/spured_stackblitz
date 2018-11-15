import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { routerTransition } from "../../router.animations";

@Component({
  selector: 'report-us',
  templateUrl: './report-us.component.html',
  styleUrls: ['./report-us.component.css'],
  providers: [],
  // animations: [routerTransition()]
})
export class ReportUsComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder) { }

  ngOnInit() {
  }

}

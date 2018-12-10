import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

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


  reportIssue(){
    alert("report issue");
  }
}

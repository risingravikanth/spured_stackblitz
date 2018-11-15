import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { routerTransition } from "../../router.animations";
import { ElementRef } from '@angular/core';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  providers: [],
  // animations: [routerTransition()]
})
export class HelpComponent implements OnInit {

  constructor(private router: Router, private formbuilder: FormBuilder) { }

  ngOnInit() {
  }

}

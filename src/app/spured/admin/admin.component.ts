import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import { AdminService } from './admin.service';
import { MobileDetectionService } from '../../shared';
import { LeftMenuService } from '../core-main/left-menu/left-menu.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [AdminService, MobileDetectionService, LeftMenuService]
})
export class AdminComponent implements OnInit {
  isMobile: boolean = false;
  listOfDepartments: any = [];

  constructor(private service: AdminService, private mobileService: MobileDetectionService, private leftMenuService: LeftMenuService) { }

  public institute: any;
  ngOnInit() {
    this.isMobile = this.mobileService.isMobile();
    this.service.getAdminInstitute().subscribe(resData => {
      this.institute = resData;
      this.getDepartmentsUnderInst(this.institute.instId);
    })
  }

  getDepartmentsUnderInst(instId) {
    this.leftMenuService.getDepartmentsByInst(instId).subscribe(resData => {
      for (var i in resData) {
        let item = resData[i];
        let id = item['deptId'];
        let name = item['deptName'];
        var obj = {
          value: id,
          label: name
        };
        this.listOfDepartments.push(obj);
      }
    })
  }
}

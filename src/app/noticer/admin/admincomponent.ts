import { Component, OnInit } from '@angular/core';
import { MobileDetectionService } from '../../shared';
import { CurrentUserService } from '../../shared/services/currentUser.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [MobileDetectionService, CurrentUserService]
})
export class AdminComponent implements OnInit {

  public listOfBoards:any = [];
  public addPeopleList:any = [];
  public removePeopleList:any = [];
  public isMobile: boolean;
  public currentUser:any;
  constructor(private mobileService:MobileDetectionService, private userService:CurrentUserService){

  }

  ngOnInit() {
    this.isMobile = this.mobileService.isMobile();
    this.currentUser = this.userService.getCurrentUser();
  }

  createBoardDialog(){
    alert("Inprogress")
  }

}

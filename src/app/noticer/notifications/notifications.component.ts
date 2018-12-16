import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from './notifications.service';
import { User } from '../../shared/models/user.model';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import * as constant from '../../shared/others/constants'
import { CommonService } from '../../shared';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  providers: [NotificationsService, CurrentUserService]
})
export class NotificationsComponent implements OnInit {

  @Output() childNotificationCount: EventEmitter<any> = new EventEmitter<any>();

  public categoryModalReference: NgbModalRef;
  closeResult: string;

  notificationsList: any = [];
  showNotifications: boolean = false;
  notificationsCount: any;

  notificationDetails: any;

  @Input() from: any
  @Input() totalNotificationsCount: any;
  limit: number = 5;
  offset: number = 0;

  public showPostSpinner = false;
  currentUser: User;
  public validUser: boolean = false;
  public showMore: boolean = false;
  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.validUser = true;
    }
    if (this.from == 'header') {
      this.limit = this.totalNotificationsCount;
    }
    if (this.validUser) {
      if (this.from == 'header') {
        this.limit = constant.onHeaderNotificationsPerPage;
      } else {
        this.limit = constant.onComponentNotificationsPerPage;
      }
      this.getAllNotifications(this.paepareGetRequest());
    }
  }

  constructor(private modalService: NgbModal,
    private notifyService: NotificationsService,
    private userService: CurrentUserService,
    private commonService:CommonService ) {

  }

  getAllNotifications(body: any) {
    this.showPostSpinner = true;
    this.notifyService.getAllMessages(body).subscribe((resData: any) => {
      this.showPostSpinner = false;
      if (resData && resData.code == "ERROR") {
        alert(resData.info);
        this.showNotifications = false;
      } else if (resData && resData.messages.length > 0) {
        if (resData.unreadCount) {
          this.notificationsCount = resData.unreadCount;
        }
        resData.messages.forEach(element => {
          this.notificationsList.push(element);
        });
        this.showMore = true;

        if (this.from == 'header') {
          this.commonService.updateHeaderMenu({type:"updateNoficiationCount", count: this.notificationsCount})
        }
        this.showNotifications = true;
      } else {
        this.showMore = false;
        this.showNotifications = false;
      }
    })
  }

  paepareGetRequest() {
    let body = {
      "data": {
        "_type": "Message",
        "messageType": "NOTIFICATION"
      },
      "pagination": {
        "limit": this.limit,
        "offset": this.offset
      }
    }
    return body;
  }

  loadMoreMessages() {
    this.offset = this.offset + constant.onComponentNotificationsPerPage;
    let body = this.paepareGetRequest();
    this.getAllNotifications(body);
  }


  openNotificationModel(notification: any, content: any) {
    this.notificationDetails = notification;
    if (notification.status != 'READ') {
      this.notificationDetails.status = "READ";
      this.notifyService.updateNotificationStatus(this.notificationDetails).subscribe(resData => {
        this.notificationsCount = this.notificationsCount - 1;
        this.commonService.updateHeaderMenu({type:"updateNoficiationCount", count: this.notificationsCount})
      })
    }
    this.categoryModalReference = this.modalService.open(content, { size: 'lg' });
    this.categoryModalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}

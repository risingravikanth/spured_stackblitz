import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from './notifications.service';

@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  providers: [NotificationsService]
})
export class NotificationsComponent implements OnInit {

  public categoryModalReference: NgbModalRef;
  closeResult: string;

  notificationsList: any = [];
  showNotifications: boolean = false;
  notificationsCount: any;

  notificationDetails: any;

  @Input() from: any
  @Input() totalNotificationsCount:any;
  limit:number = 10;

  public showPostSpinner = false;
  ngOnInit() {
    if(this.from == 'header'){
      this.limit = this.totalNotificationsCount;
    }
    this.getAllNotifications();
  }

  constructor(private modalService: NgbModal,
    private notifyService: NotificationsService) {

  }

  getAllNotifications() {
    let body = {
      "data": {
        "_type": "Message",
        "messageType": "NOTIFICATION"
      },
      "pagination": {
        "limit": 10,
        "offset": 0
      }
    }
    this.showPostSpinner = true;
    this.notifyService.getAllMessages(body).subscribe((resData: any) => {
      this.showPostSpinner = false;
      if (resData && resData.code == "ERROR") {
        alert(resData.info);
        this.showNotifications = false;
      } else if (resData && resData.unreadCount > 0) {
        this.notificationsCount = resData.unreadCount;
        this.notificationsList = resData.messages;
        this.showNotifications = true;
      } else {
        this.showNotifications = false;
      }
    })
  }


  openNotificationModel(notification: any, content: any) {
    this.notificationDetails = notification;
    if(notification.status != 'READ'){
      this.notificationDetails.status = "READ";
      this.notifyService.updateNotificationStatus(this.notificationDetails).subscribe(resData => {
  
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

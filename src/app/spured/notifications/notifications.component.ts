import { Component, OnInit, Input, Output, EventEmitter, Inject, PLATFORM_ID } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { NotificationsService } from './notifications.service';
import { User } from '../../shared/models/user.model';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import * as constant from '../../shared/others/constants'
import { CommonService, SeoService } from '../../shared';

import { TimeAgoPipe } from 'time-ago-pipe';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';
import { Router } from '@angular/router';


const NOTIFICATIONS_KEY = makeStateKey<string>('notifications');


@Component({
  selector: 'notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
  providers: [NotificationsService, CurrentUserService, SeoService]
})
export class NotificationsComponent implements OnInit {

  @Output() childNotificationCount: EventEmitter<any> = new EventEmitter<any>();

  public categoryModalReference: NgbModalRef;
  public isMobile: boolean;
  public isServer: boolean;
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
  isLoggedInUser: boolean;
  public showMore: boolean = false;



  constructor(private modalService: NgbModal,
    private notifyService: NotificationsService,
    private userService: CurrentUserService,
    public mobileService: MobileDetectionService,
    private commonService: CommonService,
    private tstate: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    private seo: SeoService,
    private router: Router) {

    this.isServer = isPlatformServer(this.platformId);

  }


  ngOnInit() {

    this.seo.generateTags({
      title: 'SpurEd - Spur: Give encouragement to Ed: Education',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'feed-page'
    })
    this.userService.setTitle("SpurEd - Spur: Give encouragement to Ed: Education")

    this.isMobile = this.mobileService.isMobile();
    //this.currentUser = this.userService.getCurrentUser();
    this.isLoggedInUser = this.userService.checkLoggedInUser();

    console.log(this.isLoggedInUser, "this.isLoggedInUser")
    if (this.isLoggedInUser) {
      this.validUser = true;
      if (this.from == 'header') {
        this.limit = this.totalNotificationsCount;
      }

      if (this.from == 'header') {
        this.limit = constant.onHeaderNotificationsPerPage;
      } else {
        this.limit = constant.onComponentNotificationsPerPage;
      }
      let request = this.prepareGetRequest();
      this.getAllNotifications(request);

    }

  }

  getAllNotifications(body: any) {
    this.showPostSpinner = true;

    //console.log(this.tstate.hasKey(NOTIFICATIONS_KEY),"this.tstate.hasKey(NOTIFICATIONS_KEY)")

    /* server side rendring */


    if (this.tstate.hasKey(NOTIFICATIONS_KEY)) {
      console.log("browser : getting NOTIFICATIONS_KEY for posts");


      let resData: any = this.tstate.get(NOTIFICATIONS_KEY, '');
      this.tstate.remove(NOTIFICATIONS_KEY);
      if (resData && resData.notifications && resData.notifications.length > 0) {
        if (resData.unreadCount) {
          this.notificationsCount = resData.unreadCount;
        }
        resData.notifications.forEach(element => {
          this.notificationsList.push(element);
        });
        this.updateLastRead(this.notificationsList);
        this.showMore = true;

        if (this.from == 'header') {
          this.commonService.updateHeaderMenu({ type: "updateNoficiationCount", count: this.notificationsCount })
        }
        this.showNotifications = true;
      } else {
        this.showMore = false;
        this.showNotifications = false;
      }


      this.showPostSpinner = false;


    } else if (this.isServer) {

      console.log("server : making service call & setting NOTIFICATIONS_KEY");

      this.notifyService.getAllMessages(body).subscribe((resData: any) => {
        this.showPostSpinner = false;
        console.log("server : making service call &", resData)
        if (resData && resData.code == "ERROR") {
          this.showNotifications = false;
        } else if (resData && resData.notifications && resData.notifications.length > 0) {
          let messagesResponse: any = resData;
          this.tstate.set(NOTIFICATIONS_KEY, messagesResponse);
          if (resData.unreadCount) {
            this.notificationsCount = resData.unreadCount;
          }
          resData.notifications.forEach(element => {
            this.notificationsList.push(element);
          });
          this.updateLastRead(this.notificationsList);
          this.showMore = true;

          if (this.from == 'header') {
            this.commonService.updateHeaderMenu({ type: "updateNoficiationCount", count: this.notificationsCount })
          }
          this.showNotifications = true;
        } else {
          this.showMore = false;
          this.showNotifications = false;
          this.tstate.set(NOTIFICATIONS_KEY, []);
        }
      });

    } else {
      console.log("no result received : making service call MESSAGES_KEY");

      this.notifyService.getAllMessages(body).subscribe((resData: any) => {
        this.showPostSpinner = false;
        if (resData && resData.code == "ERROR") {
          alert(resData.info);
          this.showNotifications = false;
        } else if (resData && resData.notifications && resData.notifications.length > 0) {
          if (resData.unreadCount) {
            this.notificationsCount = resData.unreadCount;
          }
          resData.notifications.forEach(element => {
            this.notificationsList.push(element);
          });
          this.updateLastRead(this.notificationsList);
          this.showMore = true;

          if (this.from == 'header') {
            this.commonService.updateHeaderMenu({ type: "updateNoficiationCount", count: this.notificationsCount })
          }
          this.showNotifications = true;
        } else {
          this.showMore = false;
          this.showNotifications = false;
        }
      });

    }
  }

  updateLastRead(notifications: any) {
    if (notifications.length > 0) {
      let id = notifications[0].id;
      let body = {
        "data": {
          "_type": "Notification",
          "id": id
        }
      }
      this.notifyService.updateLastRead(body).subscribe(
        resData => {
          // console.log(resData);
        }
      )
    }
  }

  prepareGetRequest() {
    let body = {
      "data": {
        "_type": "Notification",
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
    let body = this.prepareGetRequest();
    this.getAllNotifications(body);
  }


  openNotificationModel(notification: any, content: any) {
    if (notification.targetLink) {
      // this.router.navigate(["www.google.com"]);
      // window.open(notification.targetLink, "_blank")
    } else {

      this.categoryModalReference = this.modalService.open(content, { size: 'lg' });
      this.categoryModalReference.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    this.notificationDetails = notification;
    if (notification.status != 'READ') {
      this.notificationDetails.status = "READ";
      this.notifyService.updateNotificationStatus(this.notificationDetails).subscribe(resData => {
        this.notificationsCount = this.notificationsCount - 1;
        this.commonService.updateHeaderMenu({ type: "updateNoficiationCount", count: this.notificationsCount })
      })
    }
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

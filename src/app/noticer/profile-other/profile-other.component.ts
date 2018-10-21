import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from "primeng/components/common/messageservice";
import { routerTransition } from "../../router.animations";
import { CustomValidator } from "../../shared/others/custom.validator";
import { OthersProfileService } from './profile-other.service';

@Component({
  selector: 'profile-other',
  templateUrl: './profile-other.component.html',
  styleUrls: ['./profile-other.component.css'],
  providers: [OthersProfileService, CustomValidator, MessageService],
  animations: [routerTransition()]
})
export class OthersProfileComponent implements OnInit {

  constructor( private route: ActivatedRoute, private service: OthersProfileService) { }

  public profileLoader = false;
  public urls: any = [];
  ngOnInit() {
    this.route.params.subscribe(this.handleParams.bind(this));
  }

  handleParams(params: any) {
    let userId = params['id'];
    this.loadProfileDetails(userId);
  }

  loadProfileDetails(userId) {
    console.log("get profile details");
  }
}

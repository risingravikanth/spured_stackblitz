import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { User } from '../../shared/models/user.model';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    currentUser: User;
    public validUser: boolean = false;

    constructor(private userService: CurrentUserService){

    }


    ngOnInit() {
        this.currentUser = this.userService.getCurrentUser();
        if (this.currentUser) {
            this.validUser = true;
        }
    }

}

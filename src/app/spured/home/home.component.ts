import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '../../shared/services/currentUser.service';
import { User } from '../../shared/models/user.model';
import { SeoService } from '../../shared';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers:[SeoService]
})
export class HomeComponent implements OnInit {
    currentUser: User;
    public validUser: boolean = false;
    public gistMessageAry :any = [
        "Spured is a learning management system for college & students to share anything related to education & college.",
        "Boards are the hierarchy of spaces with students belongs to various batches, departments, classes and sections.",
        "A student of a class belong to his/her class board, department board, batch board and college board.",
        "Groups in the college (institute groups) are useful to create groups for various topics of discussions such as subject, library, college fest group and so on.",
        "Spured is also a knowledge networking platform to connect with scholars beyond the college.",
        "Content or questions related various sections or models of competitive exams, results, jobs, news, current affairs, any kind of events, higher education.",
        "Public groups are meant for discussion on any topic, anyone can join any public group and view content in that group.",
        "Various sections of the competitive exams are organized into categories and models to find the content what exactly needed."
    ];
    public counter : any= 0;
    public gistMessage : any= this.gistMessageAry[this.counter];
    public someInterval :any;

    /*constructor(private userService: CurrentUserService){
        setInterval(() => {
            this.changeGistMessages();
        },5000);
        
    }*/

    constructor(private zone: NgZone, private userService: CurrentUserService, private seo: SeoService) {
        let self = this;
        /*this.zone.runOutsideAngular(() => { self.someInterval = setInterval(() => { 
            // Your Code 
            self.changeGistMessages();
        }, 1000) })*/
        
    }

    changeGistMessages(){
        this.gistMessage = this.gistMessageAry[this.counter];
        this.counter++;
        if(this.counter == this.gistMessageAry.length){
            this.counter =0;
        }
    }
    ngOnInit() {

        this.seo.generateTags({
            title: 'SpurEd - Spur Encouragement to Education',
            description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
            slug: 'SpurEd'
          })
          this.userService.setTitle("SpurEd - Spur Encouragement to Education")

        this.currentUser = this.userService.getCurrentUser();
        if (this.currentUser) {
            this.validUser = true;
        }

       
    }

}

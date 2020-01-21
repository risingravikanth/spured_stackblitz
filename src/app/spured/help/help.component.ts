import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MobileDetectionService } from '../../shared/services/mobiledetection.service';
import { SeoService } from '../../shared/services/seo.service';
import { CurrentUserService } from '../../shared/services/currentUser.service';

@Component({
  selector: 'help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css'],
  providers: [MobileDetectionService, SeoService, CurrentUserService],
  // animations: [routerTransition()]
})
export class HelpComponent implements OnInit {
	
  searchHelpTopic :any = "";
  filteredTopics : any = [];
  
  helpTopics :any = [
    {
      heading : "General",
      topics :[
        {
			heading: "Can I post without sign-in",
			answer : "No, you need to signin to do any activity on this site such as post, comment, like, favorite, report etc.",
			show: false,
			imageUrl : "",
			video : "",
        },{
          heading: "Is my password secure?",
          answer : "Yes, passwords are stored in non-decodable form"
        },{
          heading: "What image formats are supported?",
          answer : "We support jpg, jpeg, png, gif, bmp image formats"
        },{
          heading: "How can I comment?",
          answer : "If you sign-in, you can find conversation icon under each post. Click on that icon and type in your comment data to make a comment on the post."
        },{
          heading: "How can I report a post?",
          "answer" : "If you sign-in, you can click on 'Report post' under options - three dots(...) of each post. We will verify the reported content, and will take them down and might impact the creator of the post not creating any posts, comments.",
        },{
          heading: "Where can I see all my posts, comments, votes, favorites?",
          answer : "We are working on it now, we will bring them shortly under user profile."
        },{
          heading: "What do I see in feed?",
          answer : "Feed shows any content created on the site by default. We are working on adding feature to users to customize the post types, categories so that you see content that you are interested in."
        },{
          "heading": "How can I change password?",
          "answer" : "Go to settings page and under 'Change password' options, you can give the current password and new     password  to	change."
        },{
          heading: "How can I delete my account?",
          answer : "Delete account options is available in settings page."
        },{
          heading: "Where can I update profile information?",
          answer : "Profile information can be updated from 'Profile' page. Click on your profile imaage, then click on 'Profile'. Go to <a href='http://spured.com/profile/self'>http://spured.com/profile/self</a> to visit your profile. 	<br>	&nbsp;&nbsp; Click on 'Edit' option in the profile page. You can edit Name, Phone number, Gender, Birthday and Address fields of your profile. You can also change your profile picture by clicking on 'Change picture' option."
        },
        {
          heading: "I tried to create an account but haven't received any email. What should I do?",
          answer : "Please check Spam folder of your inbox. You can request to resend activation link."
        },
        {
          heading: "I forgot my password, how can I reset?",
          answer : "Go to account sign-in page and click on 'Forgot password?' link or click <a href='http://spured.com/password_reset'>http://spured.com/password_reset</a>and enter your email on that page."
        },
      ]
    },
    {
      heading : "Admin",
      topics :[
        {
          heading: "Can i change my board name?",
          answer : "Yes, you can change your board name in admin sectin & for this you should have amdin access."
        },
        {
          heading: "Where can i create new board?",
          answer : "Go to -> Admin page -> click on create board button."
        }
      ]

    },
    {
      heading : "Post",
      topics :[
        {
          heading: "How to create a post?",
          answer : "You need to sign-in to create a post. You can create post of any type with a minimum of title and description."
        },{
          heading: "Can I create post with files",
          answer : "Yes,you create post with images, document file like pdf, ms doc, text & ms excel file types."
        },{
          heading: "How can I report an issue?",
          answer : "Once you sign-in, under the profile image icon, you can find 'Report Us' option where you can provide the detailsand submit. You can attach images too while submitting a request."
        },{
          heading: "Can I create a post without category or model",
          answer : "Yes, you can create post with a minimum of post type, title and text. Category and model are optional, but they helppeople to find the content easily."
        },
      ]

    },{
      heading : "Boards",
      topics :[
        {
          heading: "What are boards?",
          answer : "Boards are kind of pages for educational institutes. Access to boards are controlled by admins of respective boards. Once you request to join a your class board and approved by admin,you will be automatically be part of boards of 			various levels such as class, batch, department, college."
        }, {
          heading: "What are various levels of boards?",
		  pre:true,
          answer : "Here are some examples of various levels of boards 	<br> &nbsp;&nbsp; Class: JNTUK CSE 2017-21 (All students of this class)<br> &nbsp;&nbsp; Batch: JNTUK 2017-21 (All students of 2017-21 batch)<br> 			&nbsp;&nbsp; Department: JNTUK CSE (All students of CSE department of any batch/year)<br> 			&nbsp;&nbsp; Institute: JNTUK (All students of JNTUK of any department, any year)<br> 			Where<br> 			&nbsp;&nbsp; JNTUK is Institute code, CSE is department code, and 2017-21 is batch."
        }, {
          heading: "Can I request to join all the levels of boards",
          answer : "No, you just need to and can send request to class level boards only. Once its approved by board respective board admin, you will be automatically part of class, batch, department, college."
        },  {
          heading: "How can I join a board?",
          answer : "Just send a request to class level board that you belong to. Your request will be verified by admin of the board (might be one of your classmate) and if approved you will be joined in the boards."
        }, {
          heading: "Why is my board join request pending?",
          answer : "Once requested by user, it has to be reviewd and approved by admin of the respective board."
        }, {
          heading: "Where can I see my pending requests?",
          answer : "You can find pending requests in 'Pending Requests' tab of join board request dialog."
        }, {
          heading: "Who are board admins?",
          answer : "Admins are the leaders of the class boards. They are identified based on Student IDs and other verification methods."
        }, {
          heading: "I am a board admin, where can I find requests?",
          answer : "If you are admin of any board, you can find join requests in settings page. Click on your profile image, then click on settings to open settings page."
        }, {
          heading: "I can’t find my college or department or class board",
          answer : "You can send a request to create your institute, department, batch if they are missing in the dropdowns by selecting the checkbox and providing the necessary details. We will review the request and notify you with action."
        }, 
      ]

    },
  ]; 


  public isMobile: boolean;
  constructor(private mobile: MobileDetectionService,
    private seo: SeoService,
    private userService: CurrentUserService,
  ) { }

  ngOnInit() {
    this.isMobile = this.mobile.isMobile();
    this.seo.generateTags({
      title: 'FAQ - SpurEd',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'FAQ-page'
    })
    this.userService.setTitle("FAQ - SpurEd");
	this.filteredTopics = [
		{
			heading: "",
			topics : []
		}
	];
	
	for(let i=0; i< this.helpTopics.length;i++){
		let help = this.helpTopics[i];
		for(let j=0; j< help.topics.length;j++){
			this.filteredTopics[0].topics.push(help.topics[j]);
		}
	}
	
  }

}

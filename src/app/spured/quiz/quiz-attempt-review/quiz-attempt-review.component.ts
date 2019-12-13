import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MobileDetectionService } from '../../../shared/services/mobiledetection.service';
import { SeoService } from '../../../shared/services/seo.service';
import { CurrentUserService } from '../../../shared/services/currentUser.service';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'quiz-attempt-review',
  templateUrl: './quiz-attempt-review.component.html',
  styleUrls: ['./quiz-attempt-review.component.css'],
  providers: [MobileDetectionService, SeoService, CurrentUserService, QuizService]
})
export class QuizAttemptReviewComponent implements OnInit {

  public isMobile: boolean;
  public quizObject: any;
  public startExam: boolean;
  public endExam: boolean;
  public review: boolean;
  public timer: any;
  interval: any;
  submissionResult: any;
  submissionError: any;
  constructor(private mobile: MobileDetectionService,
    private seo: SeoService,
    private userService: CurrentUserService,
    private route: ActivatedRoute,
    private router: Router,
    private service: QuizService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(this.handleParams.bind(this));
    this.isMobile = this.mobile.isMobile();
    this.seo.generateTags({
      title: 'Quiz - SpurEd',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'Quiz'
    })
    this.userService.setTitle("Quiz - SpurEd")
  }

  handleParams(params: any[]) {
    // if (this.router.url.indexOf('quiz-create') !== -1) {
    //   this.pageTitle = "Create a Quiz";
    //   if (params['boardId']) {
    //     this.createForm.controls['data'].get('boardId').setValue(params['boardId']);
    //   }
    //   if (this.createForm) {
    //     this.addQuestionForm(-1);
    //   }
    // } else if (this.router.url.indexOf('quiz-manage') !== -1) {
    //   this.pageTitle = "Upate Quiz";
    // } else {
    //   alert("Invalid url");
    //   this.router.navigate(["/home"]);
    // }
    let id = params['quizId']
    this.service.getQuiz(id).subscribe((resData: any) => {
      console.log(resData);
      if (resData && resData.posts && resData.posts.length > 0) {
        this.quizObject = resData.posts[0];
        if (!this.quizObject.questionGroupResponse.questionGroup.attempted) {
          this.quizObject.questionGroupResponse.questionGroup.questions.forEach(item => {
            if (item.questionType == "MCQ") {
              item.userSelectedOptionids1 = null;
              item.choices.forEach(element => {
                element.isSelected = false;
              });
            } else if (item.questionType == "BLANKS") {
              item.userAnswers1 = [];
              for (let i = 0; i < item.answersCount; i++) {
                var obj = {};
                obj[i] = "";
                item.userAnswers1.push(obj);
              }
            }
          })
        }

        if (this.quizObject.questionGroupResponse.questionGroup.attempted) {
          this.quizObject.questionGroupResponse.questionGroup.questions.forEach(item => {
            if (item.questionType == "MCQ") {
              item.userAnswers = this.getSelectedId(item.choices);
            }
          })
          console.log(this.quizObject)
        }

        console.log(this.quizObject.questionGroupResponse.questionGroup.questions);
        console.log(sessionStorage.getItem("is_exam_started"));
        if (sessionStorage.getItem("is_exam_started")) {
          this.takeAction("START_EXAM");
          this.startCountdown(this.quizObject.questionGroupResponse.questionGroup.timeLimitInMinutes);
        }
      } else if (resData && resData.error && resData.error.code) {
        this.endExam = true;
        this.submissionError = true;
        this.submissionResult = resData.error.code.message;
      } else {
        this.endExam = true;
        this.submissionError = true;
        this.submissionResult = "Something went wrong!";
      }
    })
  }

  startExamFn(min) {
    this.takeAction("START_EXAM");
    sessionStorage.setItem("is_exam_started", "true");
    console.log(sessionStorage.getItem("is_exam_started"))
    this.startCountdown(min * 60);
  }

  checkAnswerd(list) {
    let l = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].answer != null && list[i].answer.length > 0) {
        l.push(true)
      } else {
        l.push(false);
      }
    }

    return l.filter(item => item == false).length == 0;
  }

  isValidMultiSelect(list) {
    return list.filter(item => item.isSelected == true).length > 0;
  }

  submit() {

    // this.takeAction("END_EXAM");
    console.log(this.quizObject.questionGroupResponse.questionGroup.questions);
    this.quizObject.questionGroupResponse.questionGroup.questions.forEach(item => {
      if (item.questionType == "MCQ") {
        item.userSelectedOptionids = [];
        if (item.multiSelect) {
          let arr = item.choices.filter(i => i.isSelected == true);
          for (let c of arr) {
            item.userSelectedOptionids.push(c.choiceId)
          }
        } else {
          // item.userSelectedOptionids1 = [];
          if (item.userSelectedOptionids1 != null) {
            item.userSelectedOptionids.push(item.userSelectedOptionids1);
          }
        }
      } else if (item.questionType == "BLANKS") {
        item.userAnswers = [];
        for (let u of item.userAnswers1) {
          item.userAnswers.push(u.answer);
        }
      }
    })
    this.service.answerQuiz(this.quizObject).subscribe((resData: any) => {
      console.log(resData);
      if (resData && resData.success && resData.success.code) {
        this.takeAction("END_EXAM");
        this.submissionError = false;
        this.submissionResult = resData.success.code.longMessage;

      } else if (resData && resData.error && resData.error.code) {
        this.takeAction("END_EXAM");
        this.submissionError = true;
        this.submissionResult = resData.error.code.message;
      }
      clearInterval(this.interval);
      sessionStorage.removeItem("countdown");
      sessionStorage.removeItem("is_exam_started");
    })
  }

  startCountdown(seconds) {
    if (sessionStorage.getItem("countdown")) {
      seconds = sessionStorage.getItem("countdown");
    } else {
      sessionStorage.setItem("countdown", seconds);
    }
    var counter = seconds;
    this.timer = new Date(1970, 0, 1).setSeconds(seconds);
    this.interval = setInterval(() => {
      console.log(sessionStorage.getItem("is_exam_started"))
      console.log(sessionStorage.getItem("countdown"))
      console.log(counter);
      this.timer = new Date(1970, 0, 1).setSeconds(counter)
      sessionStorage.setItem("countdown", counter);
      counter--;
      if (counter < 0) {
        clearInterval(this.interval);
        sessionStorage.removeItem("countdown");
        sessionStorage.removeItem("is_exam_started");
        alert("Time Over");
        this.submit();
        console.log('Ding!');
      };
    }, 1000);
  };


  takeAction(action: string) {
    switch (action) {
      case "START_EXAM":
        this.startExam = true;
        this.review = false;
        this.endExam = false;
        break;
      case "END_EXAM":
        this.startExam = false;
        this.review = false;
        this.endExam = true;
        break;
      case "REVIEW":
        this.startExam = false;
        this.review = true;
        this.endExam = false;
        break;

    }
  }

  getSelectedId(choices) {
    let arr = choices.filter(item => item.isSelected == true);
    if (arr.length == 0) {
      return null;
    }
    return arr[0].choiceId;
  }

  getIsWrongAnswer(c: any) {
    return c.isSelected == true && c.isCorrect == false;
  }


  redirectToOtherProfile(userId: any) {
    this.router.navigate(['profile/users/' + userId]);
  }

  gradingRevealTypeFn(type: any) {
    switch(type){
      case 'AFTER_DEADLINE':
        return 'After Deadline';
      case 'INSTANT':
        return 'Instant';
      case 'NONE':
        return 'None';
      default:
        return 'NA'
    }
  }

}

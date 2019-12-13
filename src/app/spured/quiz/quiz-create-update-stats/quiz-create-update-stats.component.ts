import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MobileDetectionService } from '../../../shared/services/mobiledetection.service';
import { SeoService } from '../../../shared/services/seo.service';
import { CurrentUserService } from '../../../shared/services/currentUser.service';
import { QuizService } from '../quiz.service';

@Component({
  selector: 'quiz-create-update-stats',
  templateUrl: './quiz-create-update-stats.component.html',
  styleUrls: ['./quiz-create-update-stats.component.css'],
  providers: [MobileDetectionService, SeoService, CurrentUserService, QuizService],
})
export class QuizCreateUpdateStatsComponent implements OnInit {

  public isMobile: boolean;
  public pageTitle: string;
  public startTime: any
  public endTime: any
  public questionsList: any = [];
  public createForm: FormGroup;
  form: FormGroup;
  minDate = new Date();
  public createObject: any;
  public quizId: any;
  results: any;
  isExpandRequired:boolean = true;
  constructor(private mobile: MobileDetectionService,
    private seo: SeoService,
    private userService: CurrentUserService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private service: QuizService
  ) {
    this.initCreateForm();
  }

  ngOnInit() {
    this.isMobile = this.mobile.isMobile();
    this.route.params.subscribe(this.handleParams.bind(this));
  }

  initCreateForm() {
    this.createForm = this.fb.group({
      context: this.fb.group({
        section: ["BOARD", Validators.required]
      }),
      data: this.fb.group({
        _type: ["BoardPost", Validators.required],
        postType: "QUIZ",
        boardId: [null, Validators.required],
        postId: [null],
        title: [null, [Validators.required, Validators.pattern('.*[\\S].*')]],
        text: [null, [Validators.required, Validators.pattern('.*[\\S].*')]],
        images: [],
        questionGroup: this.fb.group({
          _type: ["QuestionGroup", Validators.required],
          questions: this.fb.array([

          ]),
          shuffleQuestions: [true, Validators.required],
          maxQuestionToPresent: [5, Validators.required],
          gradingOptions: this.fb.group({
            _type: "QuestionGroupGradingOptions",
            gradingType: ["AUTO", Validators.required],
            gradeScaleOptions: this.fb.group({
              _type: ["GradeScaleOptions"],
              gradeScaleType: ["PASS_FAIL_WITH_SCORE"],
              passScore: [1],
            }),
            gradingRevealType: ["SPECIFIED_TIME", Validators.required],
            gradingRevealSpecifiedTime: [null],
            gradingRevealSpecifiedTime1: [null],
            showCorrectAnswersAfterGrading: [true, Validators.required],
            correctPoints: [1, Validators.required],
            inCorrectPoints: [0, Validators.required],
            partialScoring: [false, Validators.required],
          }),
          startTime: [null],
          endTime: [null],
          startTime1: [null, Validators.required],
          endTime1: [null, Validators.required],
          timeLimitInMinutes: [15, [Validators.required, Validators.pattern('.*[\\S].*')]]
        })
      })
    });

  }

  changeGradingRevealType() {
    if (this.createForm.get('data').get('questionGroup').get('gradingOptions').get('gradingRevealType').value != 'SPECIFIED_TIME') {
      this.createForm.get('data').get('questionGroup').get('gradingOptions').get('gradingRevealSpecifiedTime1').patchValue(null);
    }
  }

  addQuestionForm(i) {
    const questions = this.createForm.get('data').get('questionGroup').get('questions') as FormArray;
    let q = this.fb.group({
      _type: ["Question"],
      // questionId: [null],
      questionType: ['MCQ', Validators.required],
      text: [null, [Validators.required, Validators.pattern('.*[\\S].*')]],
      choices: this.fb.array([

      ]),
      answers1: this.fb.array([

      ]),
      answers: [],
      images: [],
      files: [],
      shuffleChoices: [true, Validators.required],
      gradingOptions: this.fb.group({
        _type: "QuestionGradingOptions",
        gradingType: [this.createForm.get('data').get('questionGroup').get('gradingOptions').get('gradingType').value, Validators.required],
        correctPoints: [this.createForm.get('data').get('questionGroup').get('gradingOptions').get('correctPoints').value],
        inCorrectPoints: [this.createForm.get('data').get('questionGroup').get('gradingOptions').get('inCorrectPoints').value],
        partialScoring: [true]
      })
    });
    questions.insert(i + 1, q);
    this.addChoice(i + 1, -1);
    this.addChoice(i + 1, 0);
  }


  isValid(){
    console.log(this.createForm);
    return this.createForm.invalid;
  }

  removeQuestionForm(i) {
    const questions = this.createForm.get('data').get('questionGroup').get('questions') as FormArray;
    questions.removeAt(i);
  }

  handleParams(params: any[]) {
    if (this.router.url.indexOf('quiz-create') !== -1) {
      this.pageTitle = "Create a Quiz";
      if (params['boardId']) {
        this.createForm.controls['data'].get('boardId').setValue(params['boardId']);
      }
      if (this.createForm) {
        this.addQuestionForm(-1);
      }
    } else if (this.router.url.indexOf('quiz-manage') !== -1) {
      this.isExpandRequired = false;
      this.pageTitle = "Upate Quiz";
      if (params['quizId']) {
        this.quizId = params['quizId'];
        this.service.getQuiz(this.quizId).subscribe((resData: any) => {
          if (resData && resData.posts) {
            this.createForm.patchValue(resData.posts[0]);
            this.setEditForm(resData.posts[0]);
          }
          console.log(resData);
        })
        this.service.getResults(this.quizId).subscribe((resData: any) => {
          if (resData && resData.responses) {
            this.results = resData.responses;
          }
          console.log(resData);
        })
      }
    } else {
      alert("Invalid url");
      this.router.navigate(["/home"]);
    }
  }

  addChoice(i, j) {
    const questions = this.createForm.get('data').get('questionGroup').get('questions') as FormArray;
    let ch = this.fb.group({
      // choiceId: [null],
      _type: ['QuestionChoice'],
      choiceText: [null, [Validators.required, Validators.pattern('.*[\\S].*')]],
      isCorrect: [false]
    })
    const choices = questions.controls[i].get("choices") as FormArray;
    choices.insert(j + 1, ch);
    (questions.controls[i] as FormGroup).setControl('choices', choices);
  }

  addAnswer(i, j) {
    const questions = this.createForm.get('data').get('questionGroup').get('questions') as FormArray;
    let ch = this.fb.group({
      answerText: [null, [Validators.required, Validators.pattern('.*[\\S].*')]]
    })
    const answers = questions.controls[i].get("answers1") as FormArray;
    answers.insert(j + 1, ch);
    (questions.controls[i] as FormGroup).setControl('answers1', answers);
  }

  removeChoice(i, j) {
    const questions = this.createForm.get('data').get('questionGroup').get('questions') as FormArray;
    const choices = questions.controls[i].get("choices") as FormArray;
    choices.removeAt(j);
    (questions.controls[i] as FormGroup).setControl('choices', choices);
  }

  removeAnswer(i, j) {
    const questions = this.createForm.get('data').get('questionGroup').get('questions') as FormArray;
    const choices = questions.controls[i].get("answers1") as FormArray;
    choices.removeAt(j);
    (questions.controls[i] as FormGroup).setControl('answers1', choices);
  }


  onQuestionTypeChange(i) {
    const questions = this.createForm.get('data').get('questionGroup').get('questions') as FormArray;
    if (questions.controls[i].get('questionType').value == 'MCQ') {
      const choices = questions.controls[i].get("answers1") as FormArray;
      (questions.controls[i] as FormGroup).setControl('answers1', this.fb.array([]));
      this.addChoice(i, -1);
    } else {
      const choices = questions.controls[i].get("choices") as FormArray;
      (questions.controls[i] as FormGroup).setControl('choices', this.fb.array([]));
      this.addAnswer(i, -1);
    }
  }

  setEditForm(quizObject: any) {

    this.createForm.controls['data'].get('postId').patchValue(quizObject.postId);
    this.createForm.controls['data'].get('title').patchValue(quizObject.postTitle);
    this.createForm.controls['data'].get('text').patchValue(quizObject.postText);
    this.createForm.controls['data'].get('boardId').clearValidators();
    this.createForm.controls['data'].get('boardId').updateValueAndValidity();
    // need to add questions
    this.createForm.controls['data'].get('questionGroup').get('shuffleQuestions').patchValue(quizObject.questionGroupResponse.questionGroup.shuffleQuestions);
    this.createForm.controls['data'].get('questionGroup').get('maxQuestionToPresent').patchValue(quizObject.questionGroupResponse.questionGroup.maxQuestionToPresent);
    this.createForm.controls['data'].get('questionGroup').get('gradingOptions').get('gradingType').patchValue(quizObject.questionGroupResponse.questionGroup.gradingOptions.gradingType);
    this.createForm.controls['data'].get('questionGroup').get('gradingOptions').get('gradingRevealType').patchValue(quizObject.questionGroupResponse.questionGroup.gradingOptions.gradingRevealType);
    if (quizObject.questionGroupResponse.questionGroup.gradingOptions.gradingRevealSpecifiedTime && quizObject.questionGroupResponse.questionGroup.gradingOptions.gradingRevealSpecifiedTime > 0) {
      this.createForm.controls['data'].get('questionGroup').get('gradingOptions').get('gradingRevealSpecifiedTime1').patchValue(new Date(quizObject.questionGroupResponse.questionGroup.gradingOptions.gradingRevealSpecifiedTime));
    }
    this.createForm.controls['data'].get('questionGroup').get('gradingOptions').get('showCorrectAnswersAfterGrading').patchValue(quizObject.questionGroupResponse.questionGroup.gradingOptions.showCorrectAnswersAfterGrading);
    this.createForm.controls['data'].get('questionGroup').get('gradingOptions').get('correctPoints').patchValue(quizObject.questionGroupResponse.questionGroup.gradingOptions.correctPoints);
    this.createForm.controls['data'].get('questionGroup').get('gradingOptions').get('inCorrectPoints').patchValue(quizObject.questionGroupResponse.questionGroup.gradingOptions.inCorrectPoints);
    this.createForm.controls['data'].get('questionGroup').get('gradingOptions').get('partialScoring').patchValue(quizObject.questionGroupResponse.questionGroup.gradingOptions.partialScoring);
    this.createForm.controls['data'].get('questionGroup').get('gradingOptions').get('gradeScaleOptions').get('gradeScaleType').patchValue(quizObject.questionGroupResponse.questionGroup.gradingOptions.gradeScaleOptions.gradeScaleType);
    this.createForm.controls['data'].get('questionGroup').get('gradingOptions').get('gradeScaleOptions').get('passScore').patchValue(quizObject.questionGroupResponse.questionGroup.gradingOptions.gradeScaleOptions.passScore);
    if (quizObject.questionGroupResponse.questionGroup.startTime && quizObject.questionGroupResponse.questionGroup.startTime > 0) {
      this.createForm.controls['data'].get('questionGroup').get('startTime1').patchValue(new Date(quizObject.questionGroupResponse.questionGroup.startTime));
    }
    if (quizObject.questionGroupResponse.questionGroup.endTime && quizObject.questionGroupResponse.questionGroup.endTime > 0) {
      this.createForm.controls['data'].get('questionGroup').get('endTime1').patchValue(new Date(quizObject.questionGroupResponse.questionGroup.endTime));
    }
    this.createForm.controls['data'].get('questionGroup').get('timeLimitInMinutes').patchValue(quizObject.questionGroupResponse.questionGroup.timeLimitInMinutes);
    this.setEditQuestionForm(quizObject.questionGroupResponse.questionGroup.questions);
  }

  setEditQuestionForm(questionsResponse: any) {
    const questions = this.createForm.get('data').get('questionGroup').get('questions') as FormArray;
    questionsResponse.forEach(element => {
      let q = this.fb.group({
        _type: ["Question"],
        questionId: [element.questionId],
        questionType: [element.questionType, Validators.required],
        text: [element.text, [Validators.required, Validators.pattern('.*[\\S].*')]],
        choices: [],
        answers1: [],
        answers: [],
        images: [],
        files: [],
        shuffleChoices: [element.shuffleChoices, Validators.required],
        gradingOptions: this.fb.group({
          _type: "QuestionGradingOptions",
          gradingType: [element.gradingOptions.gradingType, Validators.required],
          correctPoints: [element.gradingOptions.correctPoints],
          inCorrectPoints: [element.gradingOptions.inCorrectPoints],
          partialScoring: [true]
        })
      });
      if (element.questionType == 'MCQ') {
        let chFormArr = this.fb.array([]);
        element.choices.forEach(choice => {
          let ch = this.fb.group({
            _type: ['QuestionChoice'],
            choiceText: [choice.choiceText, [Validators.required, Validators.pattern('.*[\\S].*')]],
            choiceId: [choice.choiceId],
            isCorrect: [choice.isCorrect]
          })
          chFormArr.push(ch);
        });
        q.setControl('choices',chFormArr);
      } else {
        let chFormArr = this.fb.array([]);
        element.answers.forEach(choice => {
          let ch = this.fb.group({
            answerText: [choice, [Validators.required, Validators.pattern('.*[\\S].*')]]
          })
          chFormArr.push(ch);
        });
        q.setControl('answers1',chFormArr);
      }
      questions.push(q);
    });
  }


  submit() {
    let req: any = this.createForm.value;
    if (this.createForm.get('data').get('questionGroup').get('gradingOptions').get('gradingRevealType').value == 'SPECIFIED_TIME') {
      if (!this.createForm.get('data').get('questionGroup').get('gradingOptions').get('gradingRevealSpecifiedTime1').value) {
        alert("Reveal Time should not be empty");
        return;
      }
    }

    if (req && req.data && req.data.questionGroup && req.data.questionGroup.questions) {
      let valid = this.checkQuestionsAndAnswersValiditity(req.data.questionGroup.questions);
      if (!valid) {
        alert("Invalid questions or choices/answers");
        return;
      }
    }
    console.log(this.createForm.value)


    this.createObject = this.createForm.value;

    if (this.createObject) {
      let que: any = [];


      if (this.createObject.data.questionGroup.startTime1) {
        this.createObject.data.questionGroup.startTime = this.createObject.data.questionGroup.startTime1.getTime();
      }
      if (this.createObject.data.questionGroup.endTime1) {
        this.createObject.data.questionGroup.endTime = this.createObject.data.questionGroup.endTime1.getTime();
      }

      if (this.createObject.data.questionGroup.gradingOptions.gradingRevealSpecifiedTime1) {
        this.createObject.data.questionGroup.gradingOptions.gradingRevealSpecifiedTime = this.createObject.data.questionGroup.gradingOptions.gradingRevealSpecifiedTime1.getTime();
      }
      console.log(this.createObject.data.questionGroup.startTime1.getTime())
      this.createObject.data.images = [];
      for (let q of this.createObject.data.questionGroup.questions) {
        q.images = [];
        q.files = [];
        if (q.questionType == 'BLANKS') {
          q.answers = [];
          for (let a of q.answers1) {
            console.log(Object.values(a));
            for (let v of Object.values(a)) {
              q.answers.push(v);
            }
          }
        } else {
          q.answers = []
        }
        que.push(q);
      }
      this.createObject.data.questionGroup.questions = que;
    }

    console.log(this.createObject)
    this.service.createQuiz(this.createObject).subscribe((resData: any) => {
      console.log(resData);
      if (resData && resData.error && resData.error.code) {
        alert(resData.error.code.message)
      } else {
        alert("Quiz create successfully.")
        this.reset();
      }
    })

  }


  checkQuestionsAndAnswersValiditity(questions: any): boolean {
    let validList: any = [];
    for (let element of questions) {
      let valid;
      if (element.questionType == "MCQ") {
        valid = this.checkChoicesAndAnswersValidity(element.choices, element.questionType);
      } else {
        valid = this.checkChoicesAndAnswersValidity(element.answers1, element.questionType);
      }
      validList.push(valid);
    }
    let arr = validList.filter(item => item == false);
    return arr.length == 0;
  }

  checkChoicesAndAnswersValidity(list: any, type: any): boolean {
    if (type == 'MCQ') {
      let arr = list.filter((item: any) => item.isCorrect == true);
      return (arr.length > 0);
    } else {
      return (list.length > 0);
    }
  }


  setSEOContent() {
    this.seo.generateTags({
      title: 'Quiz - SpurEd',
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.',
      slug: 'Quiz-page'
    })
    this.userService.setTitle("Quiz - SpurEd")
  }

  reset() {
    this.initCreateForm();
  }

}

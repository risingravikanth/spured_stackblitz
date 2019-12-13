import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { Observable } from "rxjs/Observable";

@Injectable()
export class QuizService {
    constructor(private httpClient: HttpClient) { }

    ignoreProperties(data: any, ignoreList: any) {
        function replacer(key, value) {
            if (ignoreList.indexOf(key) > -1) return undefined;
            else return value;
        }
        return JSON.parse(JSON.stringify(data, replacer));
    }

    createQuiz(body: any) {
        let data = this.ignoreProperties(body, ['startTime1', 'endTime1', 'gradingRevealSpecifiedTime1', 'answers1'])
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/v2/post/create";
        return this.httpClient.post(url, JSON.stringify(data), { headers: headers });
    }

    getQuiz(id: any) {
        let body = {
            "context": {
                "section": "BOARD"
            },
            "data": {
                "postType": "QUIZ",
                "postId": id
            }
        }
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/v2/post/get";
        return this.httpClient.post(url, JSON.stringify(body), { headers: headers });
    }

    answerQuiz(body: any) {
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/v2/post/answer";
        let questions = [];

        body.questionGroupResponse.questionGroup.questions.forEach(element => {

            let obj = {
                "_type": "Question",
                "questionId": element.questionId
            }
            if (element.questionType = "MCQ") {
                obj['userSelectedOptionids'] = element.userSelectedOptionids
            } else {
                obj['userAnswers'] = element.userAnswers
            }
            questions.push(obj)
        });

        let data = {
            "context": {
                "section": "BOARD"
            },
            "data": {
                "_type": "BoardPost",
                "postType": body.postType,
                "postId": body.postId,
                questionGroup: {
                    "_type": "QuestionGroup",
                    "questions": questions
                }
            }
        }

        return this.httpClient.post(url, JSON.stringify(data), { headers: headers });
    }

    getResults(postId:any){
        let headers = new HttpHeaders().set("Content-Type", "application/json");
        let url = "/v2/post/getresults";
        let body = {
            "context" : {
                "section" : "BOARD"
            },
            "data": {
                "postId" : postId
            }
        }
        return this.httpClient.post(url, JSON.stringify(body), { headers: headers });
    }

    handleError(error: Response) {
        // console.error(error);
        return Observable.throw(error);
    }

}
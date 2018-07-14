import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Section } from '../models/section.model';

@Injectable()
export class CommonService {
	
    toggleTopics = new BehaviorSubject<boolean>(false);
    
    sectionChanges = new BehaviorSubject<Section>(null);
	
    constructor(private httpClient: HttpClient) { }
 
    updateToggle(isToggle){
        this.toggleTopics.next(isToggle);
    }

    updateByFilter(data: Section){
        this.sectionChanges.next(data);
    }
    
}
import { Injectable } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class MessageService {

    constructor(private http: Http) {

    }
}

import { MessageService } from './../svc/message.service';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html'
})
export class HomeComponent {

    constructor(private msgSvc: MessageService, private http: Http) {

    }
}

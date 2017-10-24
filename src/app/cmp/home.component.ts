import { ModelService } from '../svc/model.service';
import { MessageService } from '../svc/message.service';
import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {

    constructor(private modelSvc: ModelService, private msgSvc: MessageService, private http: Http) {
    }

    ngOnInit() {
        this.modelSvc.loadUserInfo();
    }
}

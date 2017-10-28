import { Component, OnInit } from '@angular/core';
import { ModelService } from './svc/model.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app works!';

    constructor(private modelSvc: ModelService) {
    }

    scrollTop() {
        window.scrollTo(0, 0);
    }

    ngOnInit() {
        this.modelSvc.loadUserInfo();
    }
}

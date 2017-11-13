import { Component, OnInit } from '@angular/core';
import { UserService } from './service/user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app works!';

    constructor(private userSvc: UserService) {
    }

    scrollTop() {
        window.scrollTo(0, 0);
    }

    ngOnInit() {
    }
}

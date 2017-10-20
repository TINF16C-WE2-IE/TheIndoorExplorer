import { ModelService } from './../svc/model.service';
import { RequestService } from './../svc/request.service';
import { MessageService } from './../svc/message.service';
import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html'
})
export class HomeComponent {

    constructor(private rqstSvc: RequestService, private modelSvc: ModelService, private msgSvc: MessageService, private http: Http) {
        this.rqstSvc.get(RequestService.INFO_USER, {}).subscribe(
            resp => {
                if (resp) {
                    console.log('got user info:', resp);
                    this.modelSvc.userInfo = resp;
                }
            }
        );
    }
}

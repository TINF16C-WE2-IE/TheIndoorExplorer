import { RequestService } from './../svc/request.service';
import { ModelService } from './../svc/model.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-content-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {

    constructor(private rqstSvc: RequestService, public modelSvc: ModelService) {

    }

    public performLogin(provider: string): void {
        window.location.href = RequestService.URL_LOGIN_ENDPOINT + this.rqstSvc.uriEncodeObject({'providerId': provider});
    }
}

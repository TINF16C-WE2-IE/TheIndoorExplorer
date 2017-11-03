import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RequestService } from '../svc/request.service';
import { ModelService } from '../svc/model.service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent {
    isScrolled: boolean;
    @ViewChild('appMenu') appMenu: ElementRef;

    constructor(private rqstSvc: RequestService, public modelSvc: ModelService) {
    }

    public performLogin(provider: string): void {
        window.location.href = RequestService.URL_LOGIN_ENDPOINT
            +  this.rqstSvc.uriEncodeObject({'providerId': provider})
            + '&redirect= ' + encodeURI(location.href);
    }

    public performLogout(): void {
        this.rqstSvc.get('logout', {}).subscribe(
            resp => {
                if (resp) {
                    console.log('Logout response:', resp);
                }
            }
        );
        location.reload();
    }

    @HostListener('window:scroll', ['$event'])
    onScroll() {
        this.isScrolled = window.pageYOffset > 0;
    }
}

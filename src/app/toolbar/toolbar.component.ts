import {Component, HostListener, OnInit} from '@angular/core';
import { RequestService } from '../svc/request.service';
import { ModelService } from '../svc/model.service';



@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
    isScrolled: boolean;
  constructor(private rqstSvc: RequestService, public modelSvc: ModelService) {  }

  public performLogin(provider: string): void {
        window.location.href = RequestService.URL_LOGIN_ENDPOINT + this.rqstSvc.uriEncodeObject({'providerId': provider});
    }

  public performeLogout(): void {
      this.rqstSvc.get('logout', {}).subscribe(
          resp => {
              if (resp) {
                  console.log('Logout response:', resp);
              }
          }
      );

  }

  ngOnInit() {
  }
    @HostListener('window:scroll', ['$event'])
    onScroll(event) {
        if (window.pageYOffset > 0) {
            this.isScrolled = true;
        }else {
            this.isScrolled = false;
        }
    }
}

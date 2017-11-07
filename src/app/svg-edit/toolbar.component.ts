import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import { RequestService } from '../svc/request.service';
import { ModelService } from '../svc/model.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {MapnameDialogComponent} from './dialogs/mapname-dialog.component';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

    @ViewChild('appMenu') appMenu: ElementRef;
    public searchQuery = '';

    constructor(private rqstSvc: RequestService, public modelSvc: ModelService, public dialog: MatDialog) {
    }
    openDialog(): void {
        const dialogRef = this.dialog.open(MapnameDialogComponent, {
            width: '250px',
        });
    }

    public performLogin(provider: string): void {
        window.location.href = RequestService.URL_LOGIN_ENDPOINT
            + this.rqstSvc.uriEncodeObject({'providerId': provider})
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
  ngOnInit() {
  }
    search(event) {
        this.modelSvc.currentMap.search(this.searchQuery);
        this.modelSvc.currentMap.fitToViewport();
    }

}



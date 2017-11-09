import {Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import { RequestService } from '../svc/request.service';
import { ModelService } from '../svc/model.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {MapnameDialogComponent} from './dialogs/mapname-dialog.component';
import {DeleteMapDialogComponent} from './dialogs/delete-map-dialog.component';
import {PublishMapDialogComponent} from './dialogs/publish-map-dialog.component';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

    @ViewChild('appMenu') appMenu: ElementRef;
    public searchQuery = '';

    constructor(private rqstSvc: RequestService,
                public modelSvc: ModelService,
                public nameDialog: MatDialog,
                public deleteDialog: MatDialog,
                public publishDialog: MatDialog) {
    }

    openNameDialog(): void {
        const dialogRef = this.nameDialog.open(MapnameDialogComponent, {
            width: '250px',
        });
    }

    openDeleteDialog(): void {
        const dialogRef = this.deleteDialog.open(DeleteMapDialogComponent, {
            width: '250px',
        });
    }

    openPublishDialog(): void {
        const dialogRef = this.publishDialog.open(PublishMapDialogComponent, {
            width: '250px',
        });
    }

    saveCurrentMap() {
        this.modelSvc.saveMap();
    }

    public performLogin(provider: string): void {
        window.location.href = RequestService.URL_LOGIN_ENDPOINT
            + this.rqstSvc.uriEncodeObject({'providerId': provider})
            + '&redirect= ' + encodeURI(location.href);
    }

    public performLogout(): void {
        this.rqstSvc.get(RequestService.LOGOUT, {}).subscribe(
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



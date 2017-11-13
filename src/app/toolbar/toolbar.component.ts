import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeleteMapDialogComponent } from '../map-page/dialogs/delete-map-dialog.component';
import { MapnameDialogComponent } from '../map-page/dialogs/mapname-dialog.component';
import { PublishMapDialogComponent } from '../map-page/dialogs/publish-map-dialog.component';
import { ModelService } from '../service/model.service';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

    @Input() public elevated = true;
    @Input() public editMode = false;

    public get hasMap(): boolean {
        return this.modelSvc.currentMap !== null;
    }

    public get canEdit() {
        return this.modelSvc.currentMap.permission === 1;
    }

    public get mapIdString(): string {
        if (this.hasMap) {
            const id = this.modelSvc.currentMap.id;
            return '' + (id === -1 ? 'new' : id);
        }
        else {
            return null;
        }
    }

    @ViewChild('appMenu') appMenu: ElementRef;

    constructor(public modelSvc: ModelService, public userSvc: UserService, public router: Router,
                public nameDialog: MatDialog, public deleteDialog: MatDialog, public publishDialog: MatDialog) {
    }


    ngOnInit() {

    }


    openNameDialog(): void {
        const dialogRef = this.nameDialog.open(MapnameDialogComponent, {
            width: '250px'
        });
    }

    openDeleteDialog(): void {
        const dialogRef = this.deleteDialog.open(DeleteMapDialogComponent, {
            width: '250px'
        });
    }

    openPublishDialog(): void {
        const dialogRef = this.publishDialog.open(PublishMapDialogComponent, {
            width: '250px'
        });
    }

    saveCurrentMap() {
        this.modelSvc.saveMap(newMapId => this.router.navigate(['/map', newMapId, 'edit']));
    }
}



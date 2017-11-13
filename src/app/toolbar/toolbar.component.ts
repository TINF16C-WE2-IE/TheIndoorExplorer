import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeleteMapDialogComponent } from '../map-page/dialogs/delete-map-dialog.component';
import { MapnameDialogComponent } from '../map-page/dialogs/mapname-dialog.component';
import { PublishMapDialogComponent } from '../map-page/dialogs/publish-map-dialog.component';
import { ModelService } from '../service/model.service';
import { UserService } from '../service/user.service';
import { ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { MapPageResolverService } from '../map-page/map-page-resolver.service';


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

    public get canEdit(): boolean {
        return this.modelSvc.currentMap.permission === 1;
    }

    public get mapId(): number {
        return this.modelSvc.currentMap && this.modelSvc.currentMap.id || null;
    }

    public get dirty(): boolean {
        return this.modelSvc.currentMap.dirty;
    }

    @ViewChild('appMenu') appMenu: ElementRef;

    constructor(public modelSvc: ModelService, public userSvc: UserService,
                private router: Router, private route: ActivatedRoute, private mapResolver: MapPageResolverService,
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
        this.modelSvc.saveMap(newMapId => {
            this.modelSvc.currentMap.storeClean();
            this.router.navigate(['/map', newMapId, 'edit']);
        });
    }

    discardOrExit() {
        if (this.dirty) {
            this.modelSvc.currentMap.resetClean();
        }
        else {
            if (this.mapId === null || this.mapId === -1) {
                this.router.navigate(['']);

            }
            else {
                this.router.navigate(['/map', this.mapId]);
            }
        }
    }

}



import { Pathfinder2 } from '../pathlib/pathfinder2.class';
import { MessageService } from '../service/message.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry, MatSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from '../service/model.service';
import { ToolService } from '../service/tool.service';
import { CanDeactivateComponent } from './map-page-guard.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-map-page',
    templateUrl: './map-page.component.html',
    styleUrls: ['./map-page.component.css']
})
export class MapPageComponent implements OnInit , CanDeactivateComponent {

    public editMode = false;
    public showLabels = true;
    public sideNavMode = 'over';
    public onMobile = false;
    public urlMapIdString = '';


    @ViewChild('sidenav') sidenav: MatSidenav;

    get currentMap() {
        return this.modelSvc.currentMap;
    }

    get floors() {
        if (this.currentMap) return this.currentMap.floors;
        return null;
    }


    constructor(private modelSvc: ModelService, private msgSvc: MessageService,
                private toolSvc: ToolService, private route: ActivatedRoute,
                private router: Router, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {

        iconRegistry.addSvgIcon('move', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/move.svg'));
        iconRegistry.addSvgIcon('wall', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pencil.svg'));
        iconRegistry.addSvgIcon('select', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cursor.svg'));
        iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete.svg'));
        iconRegistry.addSvgIcon('portal', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/portal.svg'));
        iconRegistry.addSvgIcon('stairs', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/stairs.svg'));
        iconRegistry.addSvgIcon('elevator', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/elevator.svg'));
    }

    ngOnInit() {
        this.route.url.subscribe(
            () => {
                const snap = this.route.snapshot;
                this.urlMapIdString = snap.params.mapId;
                const mode = snap.routeConfig.path;
                if (mode === 'edit') {
                    this.switchToEditMode();
                }
                else {
                    this.switchToViewMode();
                }
            }
        );
    }


    zoom(direction: number) {
        this.currentMap.zoom(direction);
    }

    fitToViewport() {
        this.currentMap.fitToViewport();
    }

    switchToEditMode() {
        this.editMode = true;
        if (this.modelSvc.currentMap) {
            console.log('clear graph');
            Pathfinder2.clearAllFloorGraphs(this.modelSvc.currentMap);
        }
        this.toolSvc.selectTool('Move');
        this.sideNavMode = 'side';
        this.sidenav.open();
        if (window.innerWidth <= 650) {
            this.onMobile = true;
            this.sidenav.close();
            this.sideNavMode = 'over';
        }
    }

    switchToViewMode() {
        this.editMode = false;
        this.toolSvc.selectTool('Directions');
        this.sideNavMode = 'over';
        this.sidenav.close();
    }

    canDeactivateComponent(): Observable<boolean> {
        if (this.editMode) {
            if (this.modelSvc.currentMap.dirty) {
                this.msgSvc.notify('You have unsaved changes. Please save or discard them.', 'Warning');
                return Observable.of(false);
            }
        }
        this.modelSvc.currentMapId = null;
        return Observable.of(true);
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.currentMap.fitToViewport();
    }

    closeSidenav($event: any) {
        this.sidenav.close();
    }
}

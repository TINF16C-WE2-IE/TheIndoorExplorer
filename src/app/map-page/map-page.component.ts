import { Pathfinder2 } from './../pathlib/pathfinder2.class';
import { MessageService } from './../service/message.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry, MatSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from '../service/model.service';
import { ToolService } from '../service/tool.service';

@Component({
    selector: 'app-map-page',
    templateUrl: './map-page.component.html',
    styleUrls: ['./map-page.component.css']
})
export class MapPageComponent implements OnInit {


    public editMode = false;
    public showLabels = true;
    public sideNavMode = 'over';
    public urlMapIdString = '';

    @ViewChild('sidenav') sidenav: MatSidenav;

    get currentMap() {
        return this.modelSvc.currentMap;
    }

    get floors() {
        if (this.currentMap) return this.currentMap.floors;
        return null;
    }

    get currentFloor() {
        return this.modelSvc.currentFloor;
    }


    get hasWritePermission(): boolean {
        return true;
        // return this.modelSvc.currentMap.permission === 1;
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
        this.toolSvc.selectTool('Directions');
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

                this.modelSvc.loadMap(
                    this.urlMapIdString === 'new' ? -1 : Number.parseInt(this.urlMapIdString),
                    () => this.onMapLoaded()
                );
            }
        );
    }

    private onMapLoaded() {

        // create the basic nodegraph on each floor, and insert the static elevators and stairs
        for (const f of this.floors) {

            // you can set smooth to true. This will result in a bit smoother paths,
            // but also (in the worst case) in twice as much nodes and therefore quadratic more calculation cost!
            f.floorGraph = Pathfinder2.createLinkedFloorGraph([...f.walls], 45, false);
        }

        Pathfinder2.generateTeleporterGraphOnMap(this.modelSvc.currentMap);

        for (const f of this.modelSvc.currentMap.floors) {
            f.floorGraph.paths = [];
        }
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
            Pathfinder2.clearAllFloorGraphs(this.modelSvc.currentMap);
        }
        this.toolSvc.selectTool('Move');
        this.sideNavMode = 'side';
        this.sidenav.open();
    }

    switchToViewMode() {
        this.editMode = false;
        this.toolSvc.selectTool('Directions');
        this.sideNavMode = 'over';
        this.sidenav.close();
    }


    @HostListener('window:resize', ['$event'])
    onResize() {
        this.currentMap.fitToViewport();
    }
}

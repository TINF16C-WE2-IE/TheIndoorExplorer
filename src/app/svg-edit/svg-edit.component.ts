import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry, MatSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Elevator } from '../model/elevator.class';
import { Floor } from '../model/floor.class';
import { Portal } from '../model/portal.class';
import { Selectable } from '../model/selectable.interface';
import { Stairs } from '../model/stairs.class';
import { TeleporterGroup } from '../model/teleporter-group.interface';
import { isTeleporter, Teleporter } from '../model/teleporter.interface';
import { Wall } from '../model/wall.class';
import { LinePath } from '../pathlib/line-path.class';
import { Pathfinder2 } from '../pathlib/pathfinder2.class';
import { ModelService } from '../svc/model.service';
import { Mouse } from './mouse.class';
import { DeleteTool } from './toolbox/delete-tool.class';
import { DirectionsTool } from './toolbox/directions-tool.class';
import { ElevatorTool } from './toolbox/elevator-tool.class';
import { LineTool } from './toolbox/line-tool.class';
import { MoveTool } from './toolbox/move-tool.class';
import { SelectTool } from './toolbox/select-tool.class';

@Component({
    selector: 'app-svg-edit',
    templateUrl: './svg-edit.component.html',
    styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {
    mouse: Mouse;

    public tools = [
        {'name': 'Move', 'icon': 'move'},
        {'name': 'Properties', 'icon': 'select'},
        {'name': 'Delete', 'icon': 'delete'},
        {'name': 'Draw Wall', 'icon': 'wall'},
        {'name': 'Draw Portal', 'icon': 'portal'},
        {'name': 'Draw Stairs', 'icon': 'stairs'},
        {'name': 'Place Elevator', 'icon': 'elevator'}
    ];
    public selectedTool = 'Move';
    public editMode = false;
    public searchQuery = '';
    public startQuery = '';
    public endQuery = '';
    public showLabels = true;
    public backgroundImageDataURL = null;
    public sideNavMode = 'over';
    public startpoint = true;
    public urlMapIdString = '';

    @ViewChild('sidenav') sidenav: MatSidenav;
    @ViewChild('fileUploadButton') fileUploadButton: ElementRef;
    @ViewChild('editorCanvas') editorCanvas: ElementRef;


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

    get movingPaths(): LinePath[] {
        return (this.currentFloor) ? this.currentFloor.floorGraph.paths : null;
    }

    get singleSelectedObject(): Selectable {
        if (this.modelSvc.selectedObjects.length === 1) {
            return this.modelSvc.selectedObjects[0];
        }
        return null;
    }

    get connectibleTeleporterGroups() {
        return this.modelSvc.connectibleTeleporterGroups;
    }

    get hasWritePermission(): boolean {
        return true;
        // return this.modelSvc.currentMap.permission === 1;
    }


    constructor(private modelSvc: ModelService, private route: ActivatedRoute, private router: Router,
                iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {

        iconRegistry.addSvgIcon('move', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/move.svg'));
        iconRegistry.addSvgIcon('wall', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pencil.svg'));
        iconRegistry.addSvgIcon('select', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cursor.svg'));
        iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/delete.svg'));
        iconRegistry.addSvgIcon('portal', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/portal.svg'));
        iconRegistry.addSvgIcon('stairs', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/stairs.svg'));
        iconRegistry.addSvgIcon('elevator', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/elevator.svg'));
    }

    ngOnInit() {
        this.mouse = new Mouse(this.modelSvc);
        this.selectTool('Directions');

        this.modelSvc.editorCanvas = this.editorCanvas;
        this.route.url.subscribe(
            urlSegments => {
                const mode = urlSegments[0].path;
                this.urlMapIdString = urlSegments[1].path;

                console.log(mode, this.urlMapIdString);
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
        console.log('building route graph...');
        // initialize connection graphs for pathfinding - function moved from DirectionsTool

        // create the basic nodegraph on each floor, and insert the static elevators and stairs
        for (const f of this.floors) {

            // you can set smooth to true. This will result in a bit smoother paths,
            // but also (in the worst case) in twice as much nodes and therefore quadratic more calculation cost!
            f.floorGraph = Pathfinder2.createLinkedFloorGraph([...f.walls], 45, false);
            Pathfinder2.insertPointsToFloorGraph(f.stairways.map(el => el.center), f.floorGraph, f.walls);
        }

        Pathfinder2.generateTeleporterGraphOnMap(this.modelSvc.currentMap);

        for (const f of this.modelSvc.currentMap.floors) {
            f.floorGraph.paths = [];
        }

        console.log('done!', this.modelSvc.currentMap);
    }


    selectTool($event: any) {
        console.log($event);

        this.selectedTool = $event;
        switch ($event) {
            case 'Move':
                this.mouse.tool = new MoveTool(this.mouse, this.modelSvc);
                break;
            case 'Properties':
                this.mouse.tool = new SelectTool(this.mouse, this.modelSvc);
                break;
            case 'Delete':
                this.mouse.tool = new DeleteTool(this.mouse, this.modelSvc);
                break;
            case 'Draw Wall':
                this.mouse.tool = new LineTool(this.mouse, this.modelSvc, {lineType: Wall});
                break;
            case 'Draw Portal':
                this.mouse.tool = new LineTool(this.mouse, this.modelSvc, {lineType: Portal});
                break;
            case 'Draw Stairs':
                this.mouse.tool = new LineTool(this.mouse, this.modelSvc, {lineType: Stairs});
                break;
            case 'Place Elevator':
                this.mouse.tool = new ElevatorTool(this.mouse, this.modelSvc);
                break;
            case 'Directions':
                this.mouse.tool = new DirectionsTool(this.mouse, this.modelSvc);
                break;
        }
    }

    selectFloor(id: number) {
        this.modelSvc.setCurrentFloor(id);
    }

    createFloor(cloneFrom: Floor = null) {
        this.currentMap.createFloor(cloneFrom);
        this.selectFloor(this.floors.length - 1);
    }

    moveFloor(floor: Floor, direction: number) {
        const newPos = this.currentMap.moveFloor(floor, direction);
        this.selectFloor(newPos);
    }

    removeFloor(floor: Floor) {
        this.selectFloor(0);
        this.currentMap.removeFloor(floor);
    }

    viewBoxString() {
        return (this.modelSvc.panOffset.x || 0) + ' ' + (this.modelSvc.panOffset.y || 0) + ' '
            + (this.modelSvc.canvasSize.x || 0) + ' ' + (this.modelSvc.canvasSize.y || 0);
    }

    zoom(direction: number) {
        this.currentMap.zoom(direction);
    }

    fitToViewport() {
        this.currentMap.fitToViewport();
    }

    backgroundImage(event) {
        this.backgroundImageDataURL = null;
        const file = event.target.files[0];
        if (!file.type.match('image.*')) {
            return;
        }
        const reader = new FileReader();

        const myThis = this;
        reader.addEventListener('load', function () {
            myThis.backgroundImageDataURL = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    public getSelectableColor(obj: Selectable) {
        if (this.modelSvc.selectedObjects.indexOf(obj) !== -1) return '#0d47a1';
        if (this.currentFloor.searchResults.indexOf(obj) !== -1) return '#b71c1c';
        return '#afafaf';
    }

    search(query: string) {
        console.log('search', query);
        this.currentMap.search(query);
        this.currentMap.fitToViewport();
    }

    switchToEditMode() {
        this.editMode = true;
        this.selectTool('Move');
        this.sideNavMode = 'side';
        this.sidenav.open();
    }

    switchToViewMode() {
        this.editMode = false;
        this.selectTool('Directions');
        this.sideNavMode = 'over';
        this.sidenav.close();
    }

    selectWaypoint(selected: Selectable) {
        if (this.mouse.tool instanceof DirectionsTool) {
            this.mouse.tool.selectWaypoint(selected);
        }
    }

    getTeleporterGroupDisplayName(teleporterGroup: TeleporterGroup) {
        return 'Group ' + teleporterGroup.group + ': ' +
            teleporterGroup.members.map(teleporter => {
                const floor = this.floors.find(fl => {
                    return fl.stairways.indexOf(teleporter as Stairs) !== -1
                        || fl.elevators.indexOf(teleporter as Elevator) !== -1;
                });
                const floorIndex = this.floors.indexOf(floor);
                return {index: floorIndex, floorLabel: (floor.label || '?'), stairsLabel: (teleporter.label || '?')};
            }).sort((a, b) => {
                return (a.index - b.index) || a.stairsLabel.toUpperCase().localeCompare(b.stairsLabel.toUpperCase());
            }).map(obj => {
                return obj.stairsLabel + ' (' + obj.floorLabel + ')';
            }).join(', ');
    }


    setTeleporterGroup(teleporter: Teleporter, group: number) {
        if (isTeleporter(this.singleSelectedObject)) {
            if (group === undefined) {  // new Group
                teleporter.group = Math.max(
                    0, ...this.connectibleTeleporterGroups
                              .reduce((groupsList, teleporterGroup) => groupsList.concat(teleporterGroup.group), [])
                ) + 1;
            }
            else {
                teleporter.group = group;
            }
        }
        this.modelSvc.updateConnectibleTeleporterGroups();
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.currentMap.fitToViewport();
    }

}

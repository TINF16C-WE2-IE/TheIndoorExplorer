import { LinePath } from '../pathlib/line-path.class';
import { Floor } from '../model/floor.class';
import { Selectable } from '../model/selectable.interface';
import { Wall } from '../model/wall.class';
import { ModelService, StairsGroup } from '../svc/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Mouse } from './mouse.class';
import { MoveTool } from './toolbox/move-tool.class';
import { SelectTool } from './toolbox/select-tool.class';
import { DeleteTool } from './toolbox/delete-tool.class';
import { LineTool } from './toolbox/line-tool.class';
import { DirectionsTool } from './toolbox/directions-tool.class';
import { Portal } from '../model/portal.class';
import { MatDialog, MatIconRegistry, MatSelectChange, MatSidenav } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Stairs } from '../model/stairs.class';
import { MapnameDialogComponent } from './dialogs/mapname-dialog.component';
import { DeleteMapDialogComponent } from './dialogs/delete-map-dialog.component';
import { PublishMapDialogComponent } from './dialogs/publish-map-dialog.component';

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
        {'name': 'Draw Elevator', 'icon': 'elevator'}
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

    @ViewChild('sidenav') sidenav: MatSidenav;
    @ViewChild('fileUploadButton') fileUploadButton: ElementRef;
    @ViewChild('editorCanvas') editorCanvas: ElementRef;

    get floor() {
        return this.modelSvc.currentFloor;
    }

    get floors() {
        if (this.modelSvc.currentMap) return this.modelSvc.currentMap.floors;
        return null;
    }

    get movingPaths(): LinePath[] {
        return (this.modelSvc.currentFloor) ? this.modelSvc.currentFloor.floorGraph.paths : null;
    }

    get singleSelectedObject(): Selectable {
        if (this.modelSvc.selectedObjects.length === 1) {
            return this.modelSvc.selectedObjects[0];
        }
        return null;
    }

    public getSelectableColor(obj: Selectable) {
        if (this.modelSvc.selectedObjects.indexOf(obj) !== -1) return '#0d47a1';
        if (this.modelSvc.currentFloor.searchResults.indexOf(obj) !== -1) return '#b71c1c';
        return '#afafaf';
    }

    get connectibleStairsGroups() {
        return this.modelSvc.connectibleStairsGroups;
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
        this.route.params.subscribe(
            params => {
                this.modelSvc.loadMap(
                    Number.parseInt(params['mapId']),
                    () => {
                        (<DirectionsTool>this.mouse.tool).onMapLoaded();
                    }
                );
            }
        );
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
            case 'Directions':
                this.mouse.tool = new DirectionsTool(this.mouse, this.modelSvc);
                break;
        }
    }

    selectFloor(id: number) {
        this.modelSvc.setCurrentFloor(id);
    }

    createFloor(cloneFrom: Floor = null) {
        this.modelSvc.currentMap.createFloor(cloneFrom);
        this.selectFloor(this.floors.length - 1);
    }

    moveFloor(floor: Floor, direction: number) {
        const newPos = this.modelSvc.currentMap.moveFloor(floor, direction);
        this.selectFloor(newPos);
    }

    removeFloor(floor: Floor) {
        this.selectFloor(0);
        this.modelSvc.currentMap.removeFloor(floor);
    }

    saveCurrentMap() {
        this.modelSvc.saveMap();
    }

    viewBoxString() {
        return (this.modelSvc.panOffset.x || 0) + ' ' + (this.modelSvc.panOffset.y || 0) + ' '
            + (this.modelSvc.canvasSize.x || 0) + ' ' + (this.modelSvc.canvasSize.y || 0);
    }

    zoom(direction: number) {
        this.modelSvc.currentMap.zoom(direction);
    }

    fitToViewport() {
        this.modelSvc.currentMap.fitToViewport();
    }

    backgroundImage(event) {
        this.backgroundImageDataURL = null;
        const file = event.target.files[0];
        if (!file.type.match('image.*')) {
            return;
        }
        const reader = new FileReader();

        const myThis = this;
        reader.addEventListener('load', function() {
            myThis.backgroundImageDataURL = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    search(query: string) {
        console.log('search', query);
        this.modelSvc.currentMap.search(query);
        this.modelSvc.currentMap.fitToViewport();
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

    getStairsGroupDisplayName(stairsGroup: StairsGroup) {
        return 'Group ' + stairsGroup.group + ': ' +
            stairsGroup.stairways.map(stairs => {
                const floor = this.modelSvc.currentMap.floors.find(fl => fl.stairways.indexOf(stairs) !== -1);
                const floorIndex = this.modelSvc.currentMap.floors.indexOf(floor);
                return {index: floorIndex, floorLabel: (floor.label || '?'), stairsLabel: (stairs.label || '?')};
            }).sort((a, b) => {
                return (a.index - b.index) || a.stairsLabel.toUpperCase().localeCompare(b.stairsLabel.toUpperCase());
            }).map(obj => {
                return obj.stairsLabel + '(' + obj.floorLabel + ')';
            }).join(', ');
    }


    setStairsGroup(event: MatSelectChange) {
        if (this.singleSelectedObject instanceof Stairs) {
            const group: number = event.value;
            if (group === undefined) {  // new Group
                this.singleSelectedObject.group = Math.max(
                    0, ...this.modelSvc.currentMap.floors
                              .reduce((stairsList, floor) => stairsList.concat(floor.stairways), [])
                              .map(stairs => stairs.group)
                ) + 1;
            }
            else {
                this.singleSelectedObject.group = group;
            }
        }
        this.modelSvc.updateConnectibleStairsGroups();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        console.log('resize');
        this.modelSvc.currentMap.fitToViewport();
    }

}

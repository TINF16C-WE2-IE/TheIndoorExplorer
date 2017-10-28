import { Map } from './../model/map.class';
import { Floor } from './../model/floor.class';
import { Selectable } from './../model/selectable.interface';
import { Wall } from './../model/wall.class';
import { Point } from './../model/point.class';
import { Line } from './../model/line.class';
import { ModelService } from '../svc/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, HostListener } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Mouse } from './mouse.class';
import { MoveTool } from './toolbox/move-tool.class';
import { SelectTool } from './toolbox/select-tool.class';
import { LineTool } from './toolbox/line-tool.class';
import { DirectionsTool } from './toolbox/directions-tool.class';
import { Portal } from '../model/portal.class';
import {MatIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-svg-edit',
    templateUrl: './svg-edit.component.html',
    styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {
    mouse: Mouse;

    public tools = [
        {'name': 'Move', 'icon': 'move'},
        {'name': 'Label', 'icon': 'wall'},
        {'name': 'Draw Wall', 'icon': 'wall'},
        {'name': 'Draw Portal', 'icon': 'portal'},
        {'name': 'Insert Stairs', 'icon': 'stairs'},
        {'name': 'Insert Lift', 'icon': 'elevator'},
    ];
    public selectedTool = 'Move';
    public editMode = false;
    public searchQuery = '';
    public showLabels = true;
    public backgroundImageDataURL = null;

    get floor() {
        return this.modelSvc.currentFloor;
    }

    get floors() {
        if (this.modelSvc.currentMap) return this.modelSvc.currentMap.floors;
        return null;
    }

    get movingPath(): Line[] {
        return this.modelSvc.movingPath;
    }

    get selectedObjects(): Selectable[] {
        if (this.modelSvc.currentFloor) return this.modelSvc.selectedObjects.concat(this.modelSvc.currentFloor.searchResults);
        return this.modelSvc.selectedObjects;
    }

    get singleSelectedObject(): Selectable {
        if (this.mouse.tool instanceof SelectTool && this.modelSvc.selectedObjects.length === 1) {
            return this.modelSvc.selectedObjects[0];
        }
        return null;
    }

    get hasWritePermission(): boolean {
        return true;
        // return this.modelSvc.currentMap.permission === 1;
    }


    constructor(private modelSvc: ModelService, private route: ActivatedRoute, private router: Router,
        iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {

        iconRegistry.addSvgIcon('move', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/move.svg'));
        iconRegistry.addSvgIcon('wall', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pencil.svg'));
        iconRegistry.addSvgIcon('portal', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/portal.svg'));
        iconRegistry.addSvgIcon('stairs', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/stairs.svg'));
        iconRegistry.addSvgIcon('elevator', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/elevator.svg'));
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.modelSvc.loadMap(Number.parseInt(params['mapId']));
            }
        );

        this.mouse = new Mouse(this.modelSvc);
        this.selectTool('Directions');
    }

    // generatePath moved to directions-tool

    selectTool($event: any) {
        console.log($event);
        // this.modelSvc.selectedObjects = [];
        // this.modelSvc.searchResultFloors = [];

        this.selectedTool = $event;
        switch ($event) {
            case 'Move':
              this.mouse.tool = new MoveTool(this.mouse, this.modelSvc);
              break;
            case 'Label':
              this.mouse.tool = new SelectTool(this.mouse, this.modelSvc);
              break;
            case 'Draw Wall':
              this.mouse.tool = new LineTool(this.mouse, this.modelSvc, {lineType: Wall});
              break;
            case 'Draw Portal':
              this.mouse.tool = new LineTool(this.mouse, this.modelSvc, {lineType: Portal});
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
        return this.modelSvc.panOffset.x + ' ' + this.modelSvc.panOffset.y + ' '
        + this.modelSvc.canvasSize.x + ' ' + this.modelSvc.canvasSize.y;
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
        reader.addEventListener('load', function () {
            myThis.backgroundImageDataURL = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
    }

    search(event) {
        this.modelSvc.currentMap.search(this.searchQuery);
        this.modelSvc.currentMap.fitToViewport();
    }

    switchToEditMode() {
        this.editMode = true;
        this.selectTool('Move');
    }

    selectWaypoint(selected: Selectable) {
        if (this.mouse.tool instanceof DirectionsTool) {
            this.mouse.tool.selectWaypoint(selected);
        }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        console.log('resize');
        this.modelSvc.currentMap.fitToViewport();
    }
}

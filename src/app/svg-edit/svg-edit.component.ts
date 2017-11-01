import { Map } from './../model/map.class';
import { Floor } from './../model/floor.class';
import { Wall } from './../model/wall.class';
import { Point } from './../model/point.class';
import { Line } from './../model/line.class';
import { Pathfinder } from './../lib/pathfinder.class';
import { ModelService } from '../svc/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Mouse } from './mouse.class';
import { MoveTool } from './toolbox/move-tool.class';
import { LineTool } from './toolbox/line-tool.class';
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
        {'name': 'Draw Wall', 'icon': 'wall'},
        {'name': 'Draw Portal', 'icon': 'portal'},
        {'name': 'Insert Stairs', 'icon': 'stairs'},
        {'name': 'Insert Lift', 'icon': 'elevator'},
    ];
    public selectedTool = 'Move';
    public backgroundImageDataURL = null;

    public movingPath: Line[];
    public pfinder: Pathfinder;

    get floor() {
        return this.modelSvc.currentFloor;
    }

    get floors() {
        if (this.modelSvc.currentMap) return this.modelSvc.currentMap.floors;
        return null;
    }

    constructor(private modelSvc: ModelService, private route: ActivatedRoute, private router: Router,
        iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        this.movingPath = [];
        this.pfinder = new Pathfinder();

        iconRegistry.addSvgIcon('move', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/move.svg'));
        iconRegistry.addSvgIcon('wall', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pencil.svg'));
        iconRegistry.addSvgIcon('portal', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/portal.svg'));
        iconRegistry.addSvgIcon('stairs', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/stairs.svg'));
        iconRegistry.addSvgIcon('elevator', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/elevator.svg'));
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.modelSvc.loadMap(-1);
                this.generatePath();
            }
        );

        this.mouse = new Mouse(this.modelSvc);
        this.selectTool('Move');
    }

    generatePath() {

        const start = new Point(400, 140, false);
        const end = new Point(100, 450, false);

        // create nodes graph
        const nodes = this.pfinder.createLinkedGraph(
            [...this.modelSvc.currentFloor.portals, ...this.modelSvc.currentFloor.walls]
            , 15, start, end);

        // find path in this node system
        const path = this.pfinder.findPathFromTo(nodes,
            nodes.find(el => el.x === start.x && el.y === start.y),
            nodes.find(el => el.x === end.x && el.y === end.y));
        this.movingPath = new Array();
        for (let i = 1; i < path.length; i++) {
            this.movingPath.push(new Line(
                new Point(path[i].x, path[i].y, false),
                new Point(path[i - 1].x, path[i - 1].y, false)
            ));
        }
    }

    selectTool($event: any) {
        console.log($event);
        this.selectedTool = $event;
        switch ($event) {
            case 'Move':
              this.mouse.tool = new MoveTool(this.mouse, this.modelSvc);
              break;
            case 'Draw Wall':
              this.mouse.tool = new LineTool(this.mouse, this.modelSvc, {lineType: Wall});
              break;
            case 'Draw Portal':
              this.mouse.tool = new LineTool(this.mouse, this.modelSvc, {lineType: Portal});
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

}

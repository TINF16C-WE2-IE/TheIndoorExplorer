import { Map } from './../model/map.class';
import { Wall } from './../model/wall.class';
import { Point } from './../model/point.class';
import { Line } from './../model/line.class';
import { Pathfinder } from './../lib/pathfinder.class';
import { ModelService } from '../svc/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Mouse } from './mouse.class';
import { Canvas } from './canvas.class';
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
    canvas: Canvas;

    public tools = [{'name': 'Move', 'icon': 'move'}, {'name': 'Draw Wall', 'icon': 'wall'}, {'name': 'Draw Portal', 'icon': 'portal'}];

    public movingPath: Line[];
    public pfinder: Pathfinder;

    get floor() {
        return this.modelSvc.currentFloor;
    }

    constructor(private modelSvc: ModelService, private route: ActivatedRoute, private router: Router,
        iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        this.movingPath = [];
        this.pfinder = new Pathfinder();

        iconRegistry.addSvgIcon('move', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/move.svg'));
        iconRegistry.addSvgIcon('wall', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/pencil.svg'));
        iconRegistry.addSvgIcon('portal', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/portal.svg'));
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.modelSvc.loadMap(Number.parseInt(params['mapId']));
            }
        );

        this.canvas = new Canvas();
        this.mouse = new Mouse(this.canvas);
        this.selectTool('Move');
    }

    generatePath() {

        // create nodes graph with params: threshold, svg width, svg height
        const nodes = this.pfinder.createLinkedGraph(25, 500, 500,
            [...this.modelSvc.currentFloor.portals, ...this.modelSvc.currentFloor.walls]
        );

        // find path with params: nodes list, start, end
        const path = this.pfinder.findPathFromTo(nodes, nodes[0], nodes[249]);
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

    saveCurrentMap() {
        this.modelSvc.saveMap();
    }
}

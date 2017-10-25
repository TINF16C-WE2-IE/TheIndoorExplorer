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
import { MoveTool } from './toolbox/move-tool.class';
import { LineTool } from './toolbox/line-tool.class';
import { Portal } from '../model/portal.class';

@Component({
    selector: 'app-svg-edit',
    templateUrl: './svg-edit.component.html',
    styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {
    mouse: Mouse;

    public toolnames = ['Move', 'Draw Wall', 'Draw Portal'];

    public movingPath: Line[];
    public pfinder: Pathfinder;

    get floor() {
        return this.modelSvc.currentFloor;
    }

    constructor(private modelSvc: ModelService, private route: ActivatedRoute, private router: Router) {
        this.movingPath = [];
        this.pfinder = new Pathfinder();
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.modelSvc.loadMap(-1);
                this.generatePath();
            }
        );

        this.mouse = new Mouse();
        this.selectTool('Move');
    }

    generatePath() {

        const start = new Point(450, 50, false);
        const end = new Point(100, 450, false);

        // create nodes graph
        const nodes = this.pfinder.createAdvancedLinkedGraph(
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

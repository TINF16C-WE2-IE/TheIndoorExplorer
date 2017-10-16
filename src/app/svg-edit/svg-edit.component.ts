import { Map } from './../model/map.class';
import { Vertex } from './Vertex.class';
import { Wall } from './Wall.class';
import { Door } from './Door.class';
import { RequestService } from './../svc/request.service';
import { ModelService } from './../svc/model.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/switchMap';

@Component({
    selector: 'app-svg-edit',
    templateUrl: './svg-edit.component.html',
    styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {

    movingVertex: Vertex = null;
    currentPos: Vertex = new Vertex(0, 0);
    tool = 0;
    canvasOffset = [];

    constructor(private rqstSvc: RequestService, public modelSvc: ModelService,
                private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {

        this.route.params.subscribe(
              params => {
                return this.rqstSvc.get(
                    RequestService.LIST_MAP_DETAILS, {'mapid': params['mapId']}
                ).subscribe(
                    resp => {
                        console.log('got response map details: ', resp);
                        if (resp !== null) {

                            // currently, the data is applied directly to the model data
                            this.modelSvc.curEditMap = resp;
                        }
                    }
                );
            }
        );

        const rect = document.getElementById('editorCanvas').getBoundingClientRect();
        this.canvasOffset = [rect.left, rect.top];
    }

    deserialize(from) {
        const to = this.modelSvc.curEditMap;
        this.deserializeWallType(from, to, 'walls');
        this.deserializeWallType(from, to, 'doors');
    }

    deserializeWallType(from, to: Map, type: string) {
        from[type].forEach(wall => {
            let obj = wall;
            if (type === 'walls') {
                obj = new Wall(new Vertex(wall.a.x, wall.a.y).getExistingOrMe(from), new Vertex(wall.b.x, wall.b.y));
            }
            else if (type === 'doors') {
                obj = new Door(new Vertex(wall.a.x, wall.a.y), new Vertex(wall.b.x, wall.b.y));
                obj.label = wall.label;
            }
        });
    }

    // not tested
    splitLine(wall: Wall, splitPos: Vertex) {
        const a = wall.a;
        wall.a = splitPos;
        this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].walls.push(new Wall(a, splitPos));
        console.log(this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].walls);
    }

    // not tested
    getNearbyWall(pos) {
        let foundLine = null;
        this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].walls.forEach(wall => {
            if (!wall.a.equals(wall.b)) {
                const xdiff = wall.b.x - wall.a.y;
                const ydiff = wall.b.y - wall.a.y;

                if (xdiff === 0) {
                    const shift = (this.currentPos.y - wall.a.y) / ydiff;
                    if (this.currentPos.x === wall.a.x &&  shift >= 0 && shift <= 1) {
                        foundLine = wall;
                    }
                }
                else {
                    const shift = (this.currentPos.x - wall.a.x) / xdiff;
                    if (shift >= 0 && shift <= 1) {
                        const deducedY = ydiff * shift + wall.a.y;
                        const v1: Vertex = new Vertex(0, 0).gridSnap([this.currentPos.x, this.currentPos.y], 20);
                        const v2: Vertex = new Vertex(0, 0).gridSnap([this.currentPos.x, deducedY], 20);
                        if (v1.equals(v2)) {
                            foundLine = wall;
                        }
                    }
                }
            }
        });
        return foundLine;
    }

    moveVertex(evt: MouseEvent) {
        const struct = this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel];
        if (evt.buttons) {
            if (this.movingVertex) {
                this.movingVertex.fromArray(this.currentPos.toArray());
            }
            else {
                this.movingVertex = this.currentPos.getExisting(struct);
            }
        }
    }

    endMoveVertex(evt: MouseEvent) {
        this.movingVertex = null;
    }

    draw(evt: MouseEvent, type: string) {
        const struct = this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel];
        const list = struct[type];
        if (evt.buttons) {
            if (!this.movingVertex) {
                let wall;
                if (type === 'walls') wall = new Wall(this.currentPos.getExistingOrClone(struct), this.currentPos);
                else if (type === 'doors') wall = new Door(this.currentPos.getExistingOrClone(struct), this.currentPos);
                list.push(wall);
            }
        }
    }

    endDraw(evt: MouseEvent, type: string) {
        const struct = this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel];
        const list = struct[type];
        list[list.length - 1].b = list[list.length - 1].b.getExistingOrClone(struct);
    }

    doNothing(evt: MouseEvent) {
        return false;
    }

    mouseMove(evt: MouseEvent) {
        this.currentPos.mouseGridSnap(evt, this.canvasOffset);
        const t = this.tool;
        if (t === 0) this.draw(evt, 'walls');
        else if (t === 1) this.moveVertex(evt);
        else if (t === 2) this.draw(evt, 'doors');
    }

    mouseUp(evt: MouseEvent) {
        const t = this.tool;
        if (t === 0) this.endDraw(evt, 'walls');
        else if (t === 1) this.endMoveVertex(evt);
        else if (t === 2) this.endDraw(evt, 'doors');
    }

    private saveCurrentMap() {
        this.rqstSvc.post(
            RequestService.LIST_MAP_SAVE, {'map': this.modelSvc.curEditMap}
        ).subscribe(
            resp => {
                console.log('got response map-save: ', resp);
                if (resp !== null) {

                    // TODO
                }
            }
        );
    }
}

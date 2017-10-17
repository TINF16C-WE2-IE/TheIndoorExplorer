import { RequestService } from '../svc/request.service';
import { ModelService } from '../svc/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Tool } from './tool.enum';

@Component({
    selector: 'app-svg-edit',
    templateUrl: './svg-edit.component.html',
    styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {

    moveStart = [];
    movingObjects = [];
    currentPos = [];
    tool = Tool.CREATE_WALL;
    canvasOffset = [];

    constructor(public modelSvc: ModelService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.modelSvc.load(params['mapId']);
            }
        );

        const rect = document.getElementById('editorCanvas').getBoundingClientRect();
        this.canvasOffset = [rect.left, rect.top];
    }


    mouseGridSnap(evt) {
        return this.gridSnap([evt.layerX - this.canvasOffset[0], evt.layerY - this.canvasOffset[1]]);
    }

    splitLine(wall, splitPos) {
        const a = wall.a;
        wall.a = splitPos;
        this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].walls.push({'a': a, 'b': splitPos});
        console.log(this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].walls);
    }

    getNearbyLine(pos) {
        let foundLine = null;
        this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].walls.forEach(wall => {
            if (!this.equalsXY(wall.a, wall.b)) {
                const xdiff = wall.b[0] - wall.a[0];
                const ydiff = wall.b[1] - wall.a[1];

                if (xdiff === 0) {
                    const shift = (this.currentPos[1] - wall.a[1]) / ydiff;
                    if (this.currentPos[0] === wall.a[0] && shift >= 0 && shift <= 1) {
                        foundLine = wall;
                    }
                }
                else {
                    const shift = (this.currentPos[0] - wall.a[0]) / xdiff;
                    if (shift >= 0 && shift <= 1) {
                        const deducedY = ydiff * shift + wall.a[1];
                        if (this.equalsXY(this.gridSnap([this.currentPos[0], deducedY], 20), this.gridSnap(this.currentPos, 20))) {
                            foundLine = wall;
                        }
                    }
                }
            }
        });
        return foundLine;
    }

    moveVertex(evt: MouseEvent) {
        const walls = this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].walls;
        const doors = this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].portals;
        if (evt.buttons) {
            if (this.moveStart.length) {
                this.movingObjects.forEach(obj => {
                    if (obj.pos) obj.pos = this.currentPos;
                    if (obj.a) {
                        if (this.equalsXY(obj.a, this.moveStart)) obj.a = this.currentPos;
                        if (this.equalsXY(obj.b, this.moveStart)) obj.b = this.currentPos;
                    }
                });
            }
            else {
                walls.forEach(wall => {
                    if (this.equalsXY(wall.a, this.currentPos) || this.equalsXY(wall.b, this.currentPos)) {
                        this.movingObjects.push(wall);
                    }
                });
                doors.forEach(door => {
                    if (this.equalsXY(door.pos, this.currentPos)) this.movingObjects.push(door);
                });
            }
            this.moveStart = this.currentPos;
        }
        else {
            this.moveStart = [];
            this.movingObjects = [];
        }
    }

    endMoveVertex(evt: MouseEvent) {
        this.moveStart = [];
        this.movingObjects = [];
    }

    draw(evt: MouseEvent) {
        const walls = this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].walls;
        if (evt.buttons) {
            if (this.moveStart.length) {
                walls[walls.length - 1].b = this.currentPos;
            } else {
                walls.push({'a': this.currentPos, 'b': this.currentPos});
                this.moveStart = this.currentPos;
            }
        }
        else {
            this.moveStart = [];
        }
    }

    endDraw(evt: MouseEvent) {
        this.moveStart = [];
    }

    setDoor(evt: MouseEvent) {
        const walls = this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].walls;
        const doors = this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel].portals;

        let wall = null;
        if (this.isExistingVertex(this.currentPos) || (wall = this.getNearbyLine(this.currentPos))) {
            if (wall) this.splitLine(wall, this.currentPos);
            doors.push({'pos': this.currentPos, 'id': doors.length, 'label': 'Door'});
        }
        console.log(doors);
    }


    mouseMove(evt: MouseEvent) {
        this.currentPos = this.mouseGridSnap(evt);
        const t = this.tool;
        if (t === 0) this.draw(evt);
        else if (t === 1) this.moveVertex(evt);
    }

    mouseUp(evt: MouseEvent) {
        const t = this.tool;
        if (t === 0) this.endDraw(evt);
        else if (t === 1) this.endMoveVertex(evt);
    }


}

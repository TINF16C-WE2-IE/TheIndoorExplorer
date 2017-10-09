import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-svg-edit',
    templateUrl: './svg-edit.component.html',
    styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {

    structure = [
        {
            'walls' : [],
            'doors' : []
        }
    ];
    moveStart = [];
    movingObjects = [];
    currentPos = [];
    level = 0;
    tool = 0;

    constructor() {
    }

    ngOnInit() {
    }

    gridSnap(arr, threshold?: number) {
        if (!threshold) threshold = 10;
        return [Math.round(arr[0] / threshold) * threshold, Math.round(arr[1] / threshold) * threshold];
    }

    mouseGridSnap(evt) {
        return this.gridSnap([evt.layerX, evt.layerY]);
    }

    equalsXY(a, b): boolean {
        return a[0] === b[0] && a[1] === b[1];
    }

    getWallsAtVertex(pos) {
        const wallsAtVertex = [];
        this.structure[this.level].walls.forEach(wall => {
            if (this.equalsXY(wall.a, pos)) wallsAtVertex.push(wall);
            if (this.equalsXY(wall.b, pos)) wallsAtVertex.push(wall);
        });
        return wallsAtVertex;
    }

    isExistingVertex(pos): boolean {
        return this.getWallsAtVertex(pos).length !== 0;
    }

    getRotation(pos): number {
        const walls = this.getWallsAtVertex(pos);
        let rotations = 0;
        walls.forEach(wall => {
            if (!this.equalsXY(wall.a, wall.b)) {
                const xdiff = wall.b[0] - wall.a[0];
                const ydiff = wall.b[1] - wall.a[1];

                if (xdiff === 0) {
                    rotations += 90;
                }
                else {
                    const rotation = Math.atan(ydiff / xdiff) / Math.PI * 180;
                    rotations += rotation;
                }
            }
        });
        return rotations / walls.length;
    }

    splitLine(wall, splitPos) {
        const a = wall.a;
        wall.a = splitPos;
        this.structure[this.level].walls.push({'a': a, 'b': splitPos});
        console.log(this.structure[this.level].walls);
    }

    getNearbyLine(pos) {
        let foundLine = null;
        this.structure[this.level].walls.forEach(wall => {
            if (!this.equalsXY(wall.a, wall.b)) {
                const xdiff = wall.b[0] - wall.a[0];
                const ydiff = wall.b[1] - wall.a[1];

                if (xdiff === 0) {
                    const shift = (this.currentPos[1] - wall.a[1]) / ydiff;
                    if (this.currentPos[0] === wall.a[0] &&  shift >= 0 && shift <= 1) {
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
        const walls = this.structure[this.level].walls;
        const doors = this.structure[this.level].doors;
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
        const walls = this.structure[this.level].walls;
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
        const walls = this.structure[this.level].walls;
        const doors = this.structure[this.level].doors;

        let wall = null;
        if (this.isExistingVertex(this.currentPos) || (wall = this.getNearbyLine(this.currentPos))) {
            if (wall) this.splitLine(wall, this.currentPos);
            doors.push({'pos': this.currentPos, 'id': doors.length, 'label': 'Door'});
        }
        console.log(doors);
    }

    doNothing(evt: MouseEvent) {
        return false;
    }

    mouseMove(evt: MouseEvent) {
        this.currentPos = this.mouseGridSnap(evt);
        const t = this.tool;
        if (t === 0) this.draw(evt);
        else if (t === 1) this.moveVertex(evt);
        else if (t === 2) this.doNothing(evt);
    }

    mouseUp(evt: MouseEvent) {
        const t = this.tool;
        if (t === 0) this.endDraw(evt);
        else if (t === 1) this.endMoveVertex(evt);
        else if (t === 2) this.setDoor(evt);
    }
}

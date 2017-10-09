import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-svg-edit',
    templateUrl: './svg-edit.component.html',
    styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {

    structure = [
        {
            'lines' : [],
            'doors' : []
        }
    ];
    nowDrawing = false;
    moveStart = [];
    currentPos = [];
    layer = 0;
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

    isExistingVertex(pos): boolean {
        this.structure[this.layer].lines.forEach(line => {
            if (this.equalsXY(line.a, pos)) return true;
            if (this.equalsXY(line.b, pos)) return true;
        });
        return false;
    }

    splitLine(line, splitPos) {
        const a = line.a;
        line.a = splitPos;
        this.structure[this.layer].lines.push({'a': a, 'b': splitPos});
        console.log(this.structure[this.layer].lines);
    }

    isOnExistingLine(pos): number {
        let rotation = -1;
        this.structure[this.layer].lines.forEach(line => {
            if (!this.equalsXY(line.a, line.b)) {
                const xdiff = line.b[0] - line.a[0];
                const ydiff = line.b[1] - line.a[1];

                if (xdiff === 0) {
                    const shift = (this.currentPos[1] - line.a[1]) / ydiff;
                    if (this.currentPos[0] === line.a[0] &&  shift >= 0 && shift <= 1) {
                        this.splitLine(line, this.currentPos);
                        rotation = 90;
                    }
                } else {
                    const shift = (this.currentPos[0] - line.a[0]) / xdiff;
                    if (shift >= 0 && shift <= 1) {
                        const deducedY = ydiff * shift + line.a[1];
                        if (this.equalsXY(this.gridSnap([this.currentPos[0], deducedY], 20), this.gridSnap(this.currentPos, 20))) {
                            this.splitLine(line, this.currentPos);
                            rotation = Math.atan(ydiff / xdiff) / Math.PI * 180;
                            if (rotation < 0) rotation += 360;
                        }
                    }
                }
            }
        });
        return rotation;
    }

    moveVertex(evt: MouseEvent) {
        const lines = this.structure[this.layer].lines;
        if (evt.buttons) {
            if (this.moveStart.length && !this.equalsXY(this.moveStart, this.currentPos)) {
                console.log(this.moveStart, this.currentPos);
                lines.forEach(line => {
                    if (this.equalsXY(line.a, this.moveStart)) line.a = this.currentPos;
                    if (this.equalsXY(line.b, this.moveStart)) line.b = this.currentPos;
                });
            }
            this.moveStart = this.currentPos;
        }
        else if (!evt.buttons) {
            this.moveStart = [];
        }
    }

    endMoveVertex(evt: MouseEvent) {
        this.moveStart = [];
    }

    draw(evt: MouseEvent) {
        const lines = this.structure[this.layer].lines;
        if (evt.buttons) {
            if (this.moveStart.length) {
                lines[lines.length - 1].b = this.currentPos;
            } else {
                lines.push({'a': this.currentPos, 'b': this.currentPos});
            }
            this.moveStart = this.currentPos;
        }
        else if (!evt.buttons) {
            this.moveStart = [];
        }
    }

    endDraw(evt: MouseEvent) {
        this.moveStart = [];
    }

    setDoor(evt: MouseEvent) {
        const lines = this.structure[this.layer].lines;
        const doors = this.structure[this.layer].doors;

        let rotation: number;
        if (this.isExistingVertex(this.currentPos) || (rotation = this.isOnExistingLine(this.currentPos)) >= 0) {
           doors.push({'pos': this.currentPos, 'id': doors.length, 'label': 'Door', 'rot': rotation});
        }
        console.log(doors, rotation);
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

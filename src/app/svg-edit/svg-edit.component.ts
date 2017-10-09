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
    layer = 0;
    tool = 0;

    constructor() {
    }

    ngOnInit() {
    }

    gridSnap(evt) {
        return [Math.round(evt.layerX / 10) * 10, Math.round(evt.layerY / 10) * 10];
    }

    equalsXY(a, b): boolean {
        return a[0] === b[0] && a[1] === b[1];
    }

    moveVertex(evt: MouseEvent) {
        const lines = this.structure[this.layer].lines;
        const currentPos = this.gridSnap(evt);
        if (evt.buttons) {
            if (this.moveStart.length && !this.equalsXY(this.moveStart, currentPos)) {
                console.log(this.moveStart, currentPos);
                lines.forEach(line => {
                    for (let i = 0; i < 2; i++) {
                        if (this.equalsXY(line[i], this.moveStart)) line[i] = currentPos;
                    }
                });
            }
            this.moveStart = currentPos;
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
        const currentPos = this.gridSnap(evt);
        if (evt.buttons) {
            if (this.moveStart.length) {
                lines[lines.length - 1][1] = currentPos;
            } else {
                lines.push([this.gridSnap(evt), this.gridSnap(evt)]);
            }
            this.moveStart = currentPos;
        }
        else if (!evt.buttons) {
            this.moveStart = [];
        }
    }

    endDraw(evt: MouseEvent) {
        this.moveStart = [];
    }

    setDoor(evt: MouseEvent) {
    }

    doNothing(evt: MouseEvent) {
        return false;
    }

    mouseMove(evt: MouseEvent) {
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

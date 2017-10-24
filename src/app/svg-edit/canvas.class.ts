import { Point } from '../model/point.class';
import { Mouse } from './mouse.class';

export class Canvas {
    private domElement;
    private viewportSize = 500;
    public canvasSize = 500;
    public panOffset = new Point(0, 0);
    public bodyOffset = new Point(0, 0);
    private mouseDragOrigin: {x: number, y: number};
    private panDragOrigin: {x: number, y: number};

    constructor() {
        this.domElement = document.getElementById('editorCanvas');
    }

    public getBodyOffset() {
        const offset = this.domElement.getBoundingClientRect();
        this.bodyOffset.x = offset.x;
        this.bodyOffset.y = offset.y;
    }

    public zoom(by: number, evt: Mouse = null) {
        this.canvasSize += 100 * by;
        if (this.canvasSize < 100) this.canvasSize = 100;
        if (evt) {
            this.panOffset.x += (evt.x - this.bodyOffset.x - this.viewportSize / 2) / 4;
            this.panOffset.y += (evt.x - this.bodyOffset.x - this.viewportSize / 2) / 4;
        }
    }

    public startPan(evt: MouseEvent) {
        this.mouseDragOrigin = {x: evt.x, y: evt.y};
        this.panDragOrigin = {x: this.panOffset.x, y: this.panOffset.y};
    }

    public pan(evt: MouseEvent) {
        this.panOffset.x = this.panDragOrigin.x - evt.x + this.mouseDragOrigin.x;
        this.panOffset.y = this.panDragOrigin.y - evt.y + this.mouseDragOrigin.y;
    }

    public mapMouse(evt: MouseEvent) {
        this.getBodyOffset();

        const ratio = this.canvasSize / this.viewportSize;
        const mapped = new Point(0, 0);

        mapped.x = Math.round(evt.x - this.bodyOffset.x) * ratio + this.panOffset.x;
        mapped.y = Math.round(evt.y - this.bodyOffset.y) * ratio + this.panOffset.y;

        return mapped;
    }
}

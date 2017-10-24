import { Tool } from './toolbox/tool.class';
import { Point } from '../model/point.class';

export class Mouse {
    private _x: number = null;
    private _y: number = null;
    private canvas;
    public tool: Tool;

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get xs(): number | null {
        return this.x !== null && this.y !== null ? Point.snapCoords(this._x, this._y).x : null;
    }

    get ys(): number | null {
        return this.x !== null && this.y !== null ? Point.snapCoords(this._x, this._y).y : null;
    }


    constructor() {
        this.canvas = document.getElementById('editorCanvas');
    }


    public onMouseDown(evt: MouseEvent) {
        if (this.tool) {
            this.tool.onMouseDown(evt);
        }
        return false; // disallow browser from dragging the svg image
    }

    public onMouseUp(evt: MouseEvent) {
        if (this.tool) {
            this.tool.onMouseUp(evt);
        }
    }

    public onMouseMove(evt: MouseEvent) {
        const offset = this.canvas.getBoundingClientRect();
        this._x = Math.round(evt.x - offset.x);
        this._y = Math.round(evt.y - offset.y);

        if (this.tool) {
            this.tool.onMouseMove(evt);
        }
    }

    public onMouseLeave(evt: MouseEvent) {
        this._x = null;
        this._y = null;
    }
}

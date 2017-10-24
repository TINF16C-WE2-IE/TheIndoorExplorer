import { Tool } from './toolbox/tool.class';
import { Point } from '../model/point.class';
import { Canvas } from './canvas.class';

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


    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }


    public onMouseDown(evt: MouseEvent) {
        if (this.tool) {
            if (!this.tool.onMouseDown(evt)) {
                this.canvas.startPan(evt);
            }
        }
        return false; // disallow browser from dragging the svg image
    }

    public onMouseUp(evt: MouseEvent) {
        if (this.tool) {
            this.tool.onMouseUp(evt);
        }
    }

    public onMouseMove(evt: MouseEvent) {
        const mapped = this.canvas.mapMouse(evt);
        this._x = mapped.x;
        this._y = mapped.y;

        if (this.tool) {
            if (!this.tool.onMouseMove(evt)) {
                this.canvas.pan(evt);
            }
        }
    }

    public onMouseLeave(evt: MouseEvent) {
        this._x = null;
        this._y = null;
    }

    public onWheel(evt: WheelEvent) {
        this.canvas.zoom(evt.deltaY / Math.abs(evt.deltaY), evt);
        this.onMouseMove(evt);
    }
}

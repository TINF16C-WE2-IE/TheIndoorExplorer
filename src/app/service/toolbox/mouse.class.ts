import { Tool } from './tool.class';
import { Point } from '../../model/point.class';
import { ModelService } from '../model.service';

export class Mouse {
    private _x: number = null;
    private _y: number = null;
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


    constructor(private modelSvc: ModelService) {
    }


    public onMouseDown(evt: any) {
        const mEvt: MouseEvent = this.convertTouchEvent(evt);
        if (mEvt) {
            this.mapToCanvas(mEvt);
            if (this.tool) {
                this.tool.onMouseDown(mEvt);
            }
        }
        return false; // disallow browser from dragging the svg image
    }

    public onMouseUp(evt: any) {
        const mEvt: MouseEvent = this.convertTouchEvent(evt);
        if (this.tool && mEvt) {
            this.tool.onMouseUp(mEvt);
        }
    }

    public onMouseMove(evt: any) {
        const mEvt: MouseEvent = this.convertTouchEvent(evt);
        if (mEvt) {
            this.mapToCanvas(mEvt);
            if (this.tool) {
                this.tool.onMouseMove(mEvt);
            }
        }
    }

    public onMouseLeave(evt: MouseEvent) {
        this._x = null;
        this._y = null;
    }

    private convertTouchEvent(evt: any): MouseEvent {
        if (evt.touches) {
            if (evt.touches.length === 1) {
                return new MouseEvent(evt.type, {clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY});
            }
            // if we are on touch and have multiple touch points, ignore: it is probably pinch to zoom
            return null;
        }
        return evt; // just a normal mouse event
    }

    public onWheel(evt: WheelEvent) {
        const scale = (- evt.deltaY / Math.abs(evt.deltaY)) * 0.05 + 1;
        this.modelSvc.currentMap.zoom(scale, this, evt.x, evt.y);
        this.onMouseMove(evt);
    }

    public onPinch(evt: any) {
        // use pinch center as current mouse position
        this.onMouseMove(new MouseEvent(evt.type, {clientX: evt.center.x, clientY: evt.center.y}));
        this.modelSvc.currentMap.zoom(evt.scale, this, evt.center.x, evt.center.y, true);
    }

    public onPinchEnd(evt: any) {
        // apply dangling zoom
        this.modelSvc.currentMap.updateCanvasSize(this.modelSvc.canvasSize.x, 1);
    }

    private mapToCanvas(evt: MouseEvent) {
        if (this.modelSvc.currentMap) {
            this.modelSvc.currentMap.getMapDimensions();
        }
        if (evt) {
            const ratio = this.modelSvc.canvasSize.x / this.modelSvc.viewportSize.x;
            // get offset to top left viewport corner, convert to actual canvas pixels, add panOffset
            const x = Math.round((evt.x - this.modelSvc.bodyOffset.x) * ratio + this.modelSvc.panOffset.x);
            const y = Math.round((evt.y - this.modelSvc.bodyOffset.y) * ratio + this.modelSvc.panOffset.y);
            if (!Number.isNaN(x) && !Number.isNaN(y)) {
                this._x = x;
                this._y = y;
            }
        }
    }
}

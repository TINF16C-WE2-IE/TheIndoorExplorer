import { Tool } from './toolbox/tool.class';
import { Point } from '../model/point.class';
import { ModelService } from '../svc/model.service';

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


    constructor(private modelSvc: ModelService) {
    }


    public onMouseDown(evt: any) {
        const mEvt: MouseEvent = this.convertTouchEvent(evt);
        this.mapToCanvas(mEvt);

        if (this.tool) {
            this.tool.onMouseDown(mEvt);
        }
        return false; // disallow browser from dragging the svg image
    }

    public onMouseUp(evt: any) {
        const mEvt: MouseEvent = this.convertTouchEvent(evt);
        if (this.tool) {
            this.tool.onMouseUp(mEvt);
        }
    }

    public onMouseMove(evt: any) {
        const mEvt: MouseEvent = this.convertTouchEvent(evt);
        this.mapToCanvas(mEvt);

        if (this.tool) {
            this.tool.onMouseMove(mEvt);
        }
    }

    public onMouseLeave(evt: MouseEvent) {
        this._x = null;
        this._y = null;
    }

    private convertTouchEvent(evt: any): MouseEvent {
        if (evt.touches) {
            if (evt.touches.length) return new MouseEvent(evt.type, {clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY});
            return null;
        }
        return evt;
    }

    public onWheel(evt: WheelEvent) {
        this.modelSvc.currentMap.zoom(evt.deltaY / Math.abs(evt.deltaY), evt.x, evt.y);
        this.onMouseMove(evt);
    }

    public onPinch(evt: any) {
        console.log(evt);
    }

    private mapToCanvas(evt: MouseEvent) {
        if (this.modelSvc.currentMap) {
            this.modelSvc.currentMap.getMapDimensions();
        }
        if (evt) {
            const ratioX = this.modelSvc.canvasSize.x / this.modelSvc.viewportSize.x;
            const ratioY = this.modelSvc.canvasSize.y / this.modelSvc.viewportSize.y;

            this._x = Math.round((evt.x - this.modelSvc.bodyOffset.x) * ratioX + this.modelSvc.panOffset.x);
            this._y = Math.round((evt.y - this.modelSvc.bodyOffset.y) * ratioY + this.modelSvc.panOffset.y);
        }
    }
}

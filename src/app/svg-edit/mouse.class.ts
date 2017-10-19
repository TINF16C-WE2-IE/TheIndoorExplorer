import { Point } from '../model/point.class';
import { Tool } from './toolbox/tool.class';

export class Mouse {
    private _x: number;
    private _y: number;
    public tool: Tool;

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }


    constructor(private canvasOffset: Point) {
    }


    public onMouseDown(evt: MouseEvent) {
        if (this.tool) {
            this.tool.onMouseDown(evt);
        }
    }

    public onMouseUp(evt: MouseEvent) {
        if (this.tool) {
            this.tool.onMouseUp(evt);
        }
    }

    public onMouseMove(evt: MouseEvent) {
        this._x = evt.layerX - this.canvasOffset.x;
        this._y = evt.layerY - this.canvasOffset.y;

        if (this.tool) {
            this.tool.onMouseMove(evt);
        }
    }
}

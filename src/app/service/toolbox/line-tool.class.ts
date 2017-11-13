import { Point } from '../../model/point.class';
import { Portal } from '../../model/portal.class';
import { Stairs } from '../../model/stairs.class';
import { Wall } from '../../model/wall.class';
import { ModelService } from '../model.service';
import { Mouse } from './mouse.class';
import { Tool } from './tool.class';
import { Line } from '../../model/line.class';

export abstract class LineTool extends Tool {
    protected point: Point = null;

    public get name() {
        return 'Draw Generic Line';
    }

    protected abstract createLine(start: Point, end: Point): void;

    public onMouseDown(evt: MouseEvent) {
        const start = this.getFloorPointBelowCursor();
        this.point = start.clone();
        this.createLine(start, this.point);
    }

    public onMouseUp(evt: MouseEvent) {
        // join and replace point below cursor with grabbed point instance, drop point
        this.floor.joinPoints(this.getFloorPointBelowCursor([this.point]), this.point);
        this.point = null;
    }

    public onMouseMove(evt: MouseEvent) {
        if (this.point) {
            this.point.setCoords(this.mouse.x, this.mouse.y);
        }
        return true;
    }
}

import { Tool } from './tool.class';
import { Point } from '../../model/point.class';

export class MoveTool extends Tool {
    private point: Point = null;
    public readonly name = 'Move';

    public onMouseDown(evt: MouseEvent) {
        // grab point below cursor
        this.point = this.getFloorPointBelowCursor();
    }

    public onMouseUp(evt: MouseEvent) {
        // join and replace point below cursor with grabbed point instance, drop point
        this.floor.joinPoints(this.getFloorPointBelowCursor(), this.point);
        this.point = null;
    }

    public onMouseMove(evt: MouseEvent) {
        if (this.point) {
            this.point.setCoords(this.mouse.x, this.mouse.y);
        }
    }
}

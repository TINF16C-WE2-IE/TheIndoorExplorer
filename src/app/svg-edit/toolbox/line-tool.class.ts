import { Tool } from './tool.class';
import { Point } from '../../model/point.class';
import { Wall } from '../../model/wall.class';

export class LineTool extends Tool {
    private point: Point = null;

    public get name() {
        return 'Draw wall';
    }

    public onMouseDown(evt: MouseEvent) {
        const start = this.getFloorPointBelowCursor();
        this.point = start.clone();
        this.floor.walls.push(new Wall(start, this.point));
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
    }
}

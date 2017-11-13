import { Tool } from './tool.class';
import { Point } from '../../model/point.class';
import { Elevator } from '../../model/elevator.class';

export class ElevatorTool extends Tool {
    private point: Point;

    public get name() {
        return 'Place Elevator';
    }

    public get icon() {
        return 'elevator';
    }

    public onMouseDown(evt: MouseEvent) {
        const start = this.getFloorPointBelowCursor();
        this.point = start.clone();
        this.floor.elevators.push(new Elevator('New Elevator', this.point));
        this.markDirty();
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

import { Tool } from './tool.class';
import { Point } from '../../model/point.class';

export class MoveTool extends Tool {
    private selected: {origin: Point, current: Point}[] = [];
    private dragOrigin: {x: number, y: number};

    public get name() {
        return 'Move';
    }

    public get cursorShape() {
        if (this.selected.length) return 'grabbing';
        else return 'grab';
    }

    public onMouseDown(evt: MouseEvent) {
        // grab point (or points defining lines) below cursor
        this.dragOrigin = {x: this.mouse.x, y: this.mouse.y};
        this.selected = this.getExistingObjectsBelowCursor().map(point => {
            return {origin: point.clone(), current: point};
        });
    }

    public onMouseUp(evt: MouseEvent) {
        // join and replace point below cursor with grabbed point instance, drop point
        for (const selPoint of this.selected) {
            this.floor.joinPoints(this.floor.getExistingOrThisPoint(selPoint.current), selPoint.current);
        }
        this.selected = [];
        this.dragOrigin = null;
    }

    public onMouseMove(evt: MouseEvent) {
        for (const selPoint of this.selected) {
            selPoint.current.setCoords(
                selPoint.origin.x + (this.mouse.xs - this.dragOrigin.x),
                selPoint.origin.y + (this.mouse.ys - this.dragOrigin.y)
            );
        }
    }
}

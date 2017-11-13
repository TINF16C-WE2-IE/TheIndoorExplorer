import { Point } from '../../model/point.class';
import { Tool } from './tool.class';

export class MoveTool extends Tool {
    private selected: {origin: Point, current: Point}[] = [];
    private dragOrigin: {x: number, y: number};
    private panDragOrigin: {x: number, y: number};

    public get name() {
        return 'Move';
    }

    public get icon() {
        return 'move';
    }

    public get cursorShape() {
        if (this.selected.length) return 'grabbing';
        else return 'grab';
    }

    public onMouseDown(evt: MouseEvent) {
        // grab point (or points defining lines) below cursor
        this.dragOrigin = {x: this.mouse.x, y: this.mouse.y};
        this.selected = this.getExistingObjectsBelowCursor().points.map(point => {
            return {origin: point.clone(), current: point};
        });
        if (!this.selected.length) {
            this.dragOrigin = {x: evt.x, y: evt.y};
            this.panDragOrigin = {x: this.modelSvc.panOffset.x, y: this.modelSvc.panOffset.y};
        }
    }

    public onMouseUp(evt: MouseEvent) {
        // join and replace point below cursor with grabbed point instance, drop point
        for (const selPoint of this.selected) {
            this.floor.joinPoints(this.floor.getExistingOrThisPoint(selPoint.current), selPoint.current);
        }
        this.selected = [];
        this.dragOrigin = null;
        this.panDragOrigin = null;
    }

    public onMouseMove(evt: MouseEvent) {
        for (const selPoint of this.selected) {
            selPoint.current.setCoords(
                selPoint.origin.x + (this.mouse.xs - this.dragOrigin.x),
                selPoint.origin.y + (this.mouse.ys - this.dragOrigin.y)
            );
        }
        if (this.panDragOrigin) {
            const ratio = this.modelSvc.canvasSize.x / this.modelSvc.viewportSize.x;
            this.modelSvc.panOffset.x = this.panDragOrigin.x - (evt.x - this.dragOrigin.x) * ratio;
            this.modelSvc.panOffset.y = this.panDragOrigin.y - (evt.y - this.dragOrigin.y) * ratio;
        }
    }
}

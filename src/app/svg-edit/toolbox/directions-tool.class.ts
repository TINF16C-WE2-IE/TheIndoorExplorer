import { Tool } from './tool.class';
import { Point } from '../../model/point.class';
import { Selectable } from '../../model/selectable.interface';
import { Line } from '../../model/line.class';
import { Pathfinder } from '../../lib/pathfinder.class';

export class DirectionsTool extends Tool {

    public pfinder: Pathfinder;
    private dragOrigin: {x: number, y: number};
    private panDragOrigin: {x: number, y: number};

    public get name() {
        return 'Directions';
    }

    public get cursorShape() {
        return 'pointer';
    }

    public onMouseDown(evt: MouseEvent) {
        this.dragOrigin = {x: evt.x, y: evt.y};
        this.panDragOrigin = {x: this.modelSvc.panOffset.x, y: this.modelSvc.panOffset.y};
    }

    public onMouseUp(evt: MouseEvent) {
        // select object (or points defining lines) below cursor
        const selected = this.getExistingObjectsBelowCursor().obj;
        this.selectWaypoint(selected);
        this.dragOrigin = null;
        this.panDragOrigin = null;
    }

    public onMouseMove(evt: MouseEvent) {
        if (this.panDragOrigin) {
            this.modelSvc.panOffset.x = this.panDragOrigin.x - evt.x + this.dragOrigin.x;
            this.modelSvc.panOffset.y = this.panDragOrigin.y - evt.y + this.dragOrigin.y;
        }
    }

    public selectWaypoint(selected: Selectable | any) {
        // TS has no way of checking for an interface :(
        if (this.isSelectable(selected)) {
            if (this.modelSvc.selectedObjects.length) {
                this.generatePath(this.modelSvc.selectedObjects[0].center, selected.center);
                this.modelSvc.selectedObjects = [];
            } else {
                this.modelSvc.selectedObjects.push(selected);
            }
        } else {
            this.modelSvc.selectedObjects = [];
        }
    }

    generatePath(start: Point, end: Point) {
        if (!this.pfinder) this.pfinder = new Pathfinder();

        // create nodes graph
        const nodes = this.pfinder.createLinkedGraph(
            [...this.modelSvc.currentFloor.portals, ...this.modelSvc.currentFloor.walls]
            , 15, start, end);

        // find path in this node system
        const path = this.pfinder.findPathFromTo(nodes,
            nodes.find(el => el.x === start.x && el.y === start.y),
            nodes.find(el => el.x === end.x && el.y === end.y));
        this.modelSvc.movingPath = [];
        for (let i = 1; i < path.length; i++) {
            this.modelSvc.movingPath.push(new Line(
                new Point(path[i].x, path[i].y, false),
                new Point(path[i - 1].x, path[i - 1].y, false)
            ));
        }
    }
}

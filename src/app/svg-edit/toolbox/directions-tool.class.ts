import { Tool } from './tool.class';
import { Point } from '../../model/point.class';
import { Selectable } from '../../model/selectable.interface';
import { Line } from '../../model/line.class';
import { Pathfinder } from '../../lib/pathfinder.class';

export class DirectionsTool extends Tool {

    public pfinder: Pathfinder;

    public get name() {
        return 'Label';
    }

    public get cursorShape() {
        return 'pointer';
    }

    public onMouseDown(evt: MouseEvent) {
    }

    public onMouseUp(evt: MouseEvent) {
        // select object (or points defining lines) below cursor
        const selected = this.getExistingObjectsBelowCursor().obj;
        this.selectWaypoint(selected);
    }

    public onMouseMove(evt: MouseEvent) {
    }

    public selectWaypoint(selected: Selectable) {
        // TS has no way of checking for an interface :(
        if (selected && selected.id && selected.label) {
            if (this.modelSvc.selectedObjects.length) {
                this.generatePath(this.modelSvc.selectedObjects[0].center(), selected.center());
                this.modelSvc.selectedObjects = [];
            } else {
                this.modelSvc.selectedObjects.push(selected);
            }
        }
        console.log(this.modelSvc.selectedObjects);
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
        this.modelSvc.movingPath = new Array();
        for (let i = 1; i < path.length; i++) {
            this.modelSvc.movingPath.push(new Line(
                new Point(path[i].x, path[i].y, false),
                new Point(path[i - 1].x, path[i - 1].y, false)
            ));
        }
    }
}

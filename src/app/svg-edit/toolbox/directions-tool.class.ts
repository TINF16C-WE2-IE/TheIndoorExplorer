import { StairNode } from './../../lib/stair-node.class';
import { Floor } from './../../model/floor.class';
import { LinePath } from './../../lib/line-path.class';
import { ModelService } from './../../svc/model.service';
import { Mouse } from './../mouse.class';
import { Pathfinder2 } from './../../lib/pathfinder2.class.';
import { Tool } from './tool.class';
import { Point } from '../../model/point.class';
import { Selectable } from '../../model/selectable.interface';
import { Line } from '../../model/line.class';
import { Pathfinder } from '../../lib/pathfinder.class';

export class DirectionsTool extends Tool {

    public pfinder: Pathfinder2;
    private dragOrigin: {x: number, y: number};
    private panDragOrigin: {x: number, y: number};

    constructor(mouse: Mouse, modelSvc: ModelService, public args = {}) {
        super(mouse, modelSvc, args);

        if (!this.pfinder) this.pfinder = new Pathfinder2();
    }

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
            const ratio = this.modelSvc.canvasSize.x / this.modelSvc.viewportSize.x;
            this.modelSvc.panOffset.x = this.panDragOrigin.x - (evt.x - this.dragOrigin.x) * ratio;
            this.modelSvc.panOffset.y = this.panDragOrigin.y - (evt.y - this.dragOrigin.y) * ratio;
        }
    }

    public selectWaypoint(selected: Selectable | any) {
        // TS has no way of checking for an interface :(
        if (this.isSelectable(selected)) {
            if (this.modelSvc.selectedObjects.length) {
                // DEPRECATED. but maybe we need this still here for debugging or testing
                // this.pfinder.generatePath(this.modelSvc.selectedObjects[0].center, selected.center, this.modelSvc.currentFloor);

                this.pfinder.generateGlobalPath(this.modelSvc.selectedObjects[0].center,
                        this.modelSvc.currentFloorId, selected.center, this.modelSvc.currentFloorId, this.modelSvc.currentMap);
                this.modelSvc.selectedObjects = [];
            } else {
                this.modelSvc.selectedObjects.push(selected);
            }
        } else {
            this.modelSvc.selectedObjects = [];
        }
    }

    public onMapLoaded() {

        // create the basic nodegraph on each floor, and insert the static elevators and stairs
        for (const f of this.modelSvc.currentMap.floors) {
            f.floorGraph = this.pfinder.createLinkedFloorGraph([...f.walls], 45, 1);
            this.pfinder.insertPointsToFloorGraph(f.stairways.map(el => el.center), f.floorGraph, f.walls);
        }

        this.pfinder.generateStairGraphOnMap(this.modelSvc.currentMap);
    }
}

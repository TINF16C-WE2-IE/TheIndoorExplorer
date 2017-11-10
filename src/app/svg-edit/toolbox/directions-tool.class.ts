import { ModelService } from '../../svc/model.service';
import { Mouse } from '../mouse.class';
import { Pathfinder2 } from '../../pathlib/pathfinder2.class.';
import { Tool } from './tool.class';
import { isSelectable, Selectable } from '../../model/selectable.interface';

export class DirectionsTool extends Tool {

    public pfinder: Pathfinder2;
    private selectedDest1: {p: Point, fid: number};

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
        if (isSelectable(selected)) {
            if (this.modelSvc.selectedObjects.length) {

                this.pfinder.generateGlobalPath(this.selectedDest1.p,
                        this.selectedDest1.fid, selected.center, this.modelSvc.currentFloorId, this.modelSvc.currentMap);
                this.modelSvc.selectedObjects = [];
            } else {
                this.modelSvc.selectedObjects.push(selected);

                for (const f of this.modelSvc.currentMap.floors) {
                    for (const p of f.portals.concat(f.stairways)) {
                        if (p === selected) {
                            this.selectedDest1 = {p: selected.center, fid: this.modelSvc.currentMap.floors.indexOf(f)};
                        }
                    }
                }
            }
        } else {
            this.modelSvc.selectedObjects = [];
        }

        // just debug test, selecting points on different floors. Of course only works on maps with a floor above the selected point
        /*
        if (this.isSelectable(selected)) {
                this.pfinder.generateGlobalPath(selected.center,
                        this.modelSvc.currentFloorId, selected.center, this.modelSvc.currentFloorId + 1, this.modelSvc.currentMap);
                this.modelSvc.selectedObjects = [];

        } else {
            this.modelSvc.selectedObjects = [];
        }
        */
    }

    public onMapLoaded() {

        // create the basic nodegraph on each floor, and insert the static elevators and stairs
        for (const f of this.modelSvc.currentMap.floors) {

            // you can set smooth to true. This will result in a bit smoother paths,
            // but also (in the worst case) in twice as much nodes and therefore quadratic more calculation cost!
            f.floorGraph = this.pfinder.createLinkedFloorGraph([...f.walls], 45, false);
            this.pfinder.insertPointsToFloorGraph(f.stairways.map(el => el.center), f.floorGraph, f.walls);
        }

        this.pfinder.generateStairGraphOnMap(this.modelSvc.currentMap);

        for (const f of this.modelSvc.currentMap.floors) {
            f.floorGraph.paths = [];
        }
    }
}

import { Point } from '../../model/point.class';
import { isSelectable, Selectable } from '../../model/selectable.interface';
import { Pathfinder2 } from '../../pathlib/pathfinder2.class';
import { Tool } from './tool.class';

export class DirectionsTool extends Tool {

    private selectedDest1: {p: Point, fid: number};
    private dragOrigin: {x: number, y: number};
    private panDragOrigin: {x: number, y: number};


    public get name() {
        return 'Directions';
    }

    public get icon(): string {
        return null;
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

    public selectWaypoint(selected: Selectable, floorArrayIndex: number = null) {

        console.log('selected:', selected);

        // TS has no way of checking for an interface :(
        if (isSelectable(selected)) {


            // if we dont know the floor index, search for it.
            if (floorArrayIndex === null || floorArrayIndex === undefined) {
                for (const f of this.modelSvc.currentMap.floors) {
                    for (const p of f.getAllSelectables()) {
                        if (p === selected) {
                            floorArrayIndex = this.modelSvc.currentMap.floors.indexOf(f);
                        }
                    }
                }
            }
            if (this.modelSvc.selectedObjects.length === 2) {
                this.modelSvc.selectedObjects = [];
                Pathfinder2.clearAllFloorGraphs(this.modelSvc.currentMap);
            }

            if (this.modelSvc.selectedObjects.length) {

                Pathfinder2.generateGlobalPath(selected.center, floorArrayIndex, this.selectedDest1.p,
                    this.selectedDest1.fid, this.modelSvc.currentMap);
            }
            else {
                this.selectedDest1 = {p: selected.center, fid: floorArrayIndex};
            }
            this.modelSvc.selectedObjects.push(selected);
        }
        else {
            this.modelSvc.selectedObjects = [];
        }
    }
}

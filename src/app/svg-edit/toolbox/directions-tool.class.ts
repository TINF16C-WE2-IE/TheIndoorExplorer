import { Selectable } from '../../model/selectable.interface';
import { Pathfinder2 } from '../../pathlib/pathfinder2.class';
import { ModelService } from '../../svc/model.service';
import { Mouse } from '../mouse.class';
import { Tool } from './tool.class';

export class DirectionsTool extends Tool {

    private dragOrigin: {x: number, y: number};
    private panDragOrigin: {x: number, y: number};

    constructor(mouse: Mouse, modelSvc: ModelService, public args = {}) {
        super(mouse, modelSvc, args);
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

                Pathfinder2.generateGlobalPath(this.modelSvc.selectedObjects[0].center,
                    this.modelSvc.currentFloorId, selected.center, this.modelSvc.currentFloorId, this.modelSvc.currentMap);
                this.modelSvc.selectedObjects = [];
            }
            else {
                this.modelSvc.selectedObjects.push(selected);
            }
        }
        else {
            this.modelSvc.selectedObjects = [];
        }

        // just debug test, selecting points on different floors. Of course only works on maps with a floor above the selected point
        /*
        if (this.isSelectable(selected)) {
                Pathfinder2.generateGlobalPath(selected.center,
                        this.modelSvc.currentFloorId, selected.center, this.modelSvc.currentFloorId + 1, this.modelSvc.currentMap);
                this.modelSvc.selectedObjects = [];

        } else {
            this.modelSvc.selectedObjects = [];
        }
        */
    }

}

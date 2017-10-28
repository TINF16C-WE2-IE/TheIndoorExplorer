import { Tool } from './tool.class';
import { Point } from '../../model/point.class';

export class SelectTool extends Tool {

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
        // TS has no way of checking for an interface :(
        this.modelSvc.selectedObjects = this.isSelectable(selected) ? [selected] : [];
    }

    public onMouseMove(evt: MouseEvent) {
    }
}

import { Tool } from './tool.class';

export class DeleteTool extends Tool {

    public get name() {
        return 'Delete';
    }

    public get cursorShape() {
        return 'pointer';
    }

    public onMouseDown(evt: MouseEvent) {
    }

    public onMouseUp(evt: MouseEvent) {
        const selected = this.getExistingObjectsBelowCursor().obj;
        selected.deleted = true;
        this.modelSvc.currentFloor.applyDelete();
    }

    public onMouseMove(evt: MouseEvent) {
    }
}

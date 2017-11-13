import { Tool } from './tool.class';

export class DeleteTool extends Tool {

    public get name() {
        return 'Delete';
    }

    public get icon() {
        return 'delete';
    }

    public get cursorShape() {
        return 'pointer';
    }

    public onMouseDown(evt: MouseEvent) {
    }

    public onMouseUp(evt: MouseEvent) {
        const selected = this.getExistingObjectsBelowCursor().obj;
        if (selected) {
            this.markDirty();
            this.floor.walls = this.floor.walls.filter(line => line !== selected);
            this.floor.portals = this.floor.portals.filter(line => line !== selected);
            this.floor.stairways = this.floor.stairways.filter(line => line !== selected);
            this.modelSvc.selectedObjects = [];
        }
    }

    public onMouseMove(evt: MouseEvent) {
    }
}

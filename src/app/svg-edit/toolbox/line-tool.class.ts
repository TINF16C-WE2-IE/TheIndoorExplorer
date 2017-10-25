import { Tool } from './tool.class';
import { Point } from '../../model/point.class';
import { Wall } from '../../model/wall.class';
import { Portal } from '../../model/portal.class';
import { Mouse } from '../mouse.class';
import { ModelService } from '../../svc/model.service';

export class LineTool extends Tool {
    private point: Point = null;

    public get lineType() {
        return this.args['lineType'];
    }

    public get name() {
        switch (this.lineType) {
            case Wall: {
                return 'Draw Wall';
            }
            case Portal: {
                return 'Draw Portal';
            }
        }
    }


    constructor(mouse: Mouse, modelSvc: ModelService, args: {lineType: any}) {
        super(mouse, modelSvc, args);
    }


    public onMouseDown(evt: MouseEvent) {
        const start = this.getFloorPointBelowCursor();
        this.point = start.clone();
        switch (this.lineType) {
            case Wall: {
                this.floor.walls.push(new Wall(start, this.point));
            }
                break;
            case Portal: {
                const id = Math.max(0, ...this.floor.portals.map(portal => portal.id)) + 1;
                this.floor.portals.push(new Portal(id, 'New Portal!', start, this.point));
            }
                break;
        }
        return true;
    }

    public onMouseUp(evt: MouseEvent) {
        // join and replace point below cursor with grabbed point instance, drop point
        this.floor.joinPoints(this.getFloorPointBelowCursor([this.point]), this.point);
        this.point = null;
    }

    public onMouseMove(evt: MouseEvent) {
        if (this.point) {
            this.point.setCoords(this.mouse.x, this.mouse.y);
        }
        return true;
    }
}

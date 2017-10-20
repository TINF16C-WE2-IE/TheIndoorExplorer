import { Mouse } from '../mouse.class';
import { Point } from '../../model/point.class';
import { ModelService } from '../../svc/model.service';

export abstract class Tool {
    public readonly name;

    protected get floor() {
        return this.modelSvc.currentFloor;
    }

    constructor(protected mouse: Mouse, private modelSvc: ModelService) {
    }


    public abstract onMouseDown(evt: MouseEvent);

    public abstract onMouseUp(evt: MouseEvent);

    public abstract onMouseMove(evt: MouseEvent);


    protected getFloorPointBelowCursor(): Point {
        return this.floor.getExistingPoint(new Point(this.mouse.x, this.mouse.y));
    }
}

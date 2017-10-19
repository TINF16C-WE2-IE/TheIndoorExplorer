import { Mouse } from '../mouse.class';
import { Floor } from '../../model/floor.class';
import { Point } from '../../model/point.class';

export abstract class Tool {

    constructor(protected floor: Floor, protected mouse: Mouse) {
    }


    public abstract onMouseDown(evt: MouseEvent);

    public abstract onMouseUp(evt: MouseEvent);

    public abstract onMouseMove(evt: MouseEvent);


    protected getFloorPointBelowCursor(): Point {
        return this.floor.getExistingPoint(new Point(this.mouse.x, this.mouse.y));
    }
}

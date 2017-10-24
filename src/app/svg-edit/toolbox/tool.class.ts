import { Mouse } from '../mouse.class';
import { Point } from '../../model/point.class';
import { ModelService } from '../../svc/model.service';
import { Line } from '../../model/line.class';

export abstract class Tool {
    public get name() {
        return 'Generic Tool';
    }

    public get cursorShape() {
        return 'crosshair';
    }

    protected get floor() {
        return this.modelSvc.currentFloor;
    }

    constructor(protected mouse: Mouse, private modelSvc: ModelService, public args = {}) {
    }


    public abstract onMouseDown(evt: MouseEvent);

    public abstract onMouseUp(evt: MouseEvent);

    public abstract onMouseMove(evt: MouseEvent);


    protected getFloorPointBelowCursor(exclude?: Point[]): Point {
        return this.floor.getExistingOrThisPoint(new Point(this.mouse.x, this.mouse.y), exclude);
    }

    protected getExistingObjectsBelowCursor(lineAccuracy = 5): Point[] {
        const point = this.floor.getExistingOrThisPoint(new Point(this.mouse.x, this.mouse.y), [], true);
        if (point) {
            return [point];
        }
        else {
            const lines = ([...this.floor.walls, ...this.floor.portals] as Line[]).map(line => {
                const [x0, y0, x1, y1, x2, y2] = [this.mouse.x, this.mouse.y, line.p1.x, line.p1.y, line.p2.x, line.p2.y];
                const distance = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1)
                    / Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);
                return {distance: distance, line: line};
            });
            const line = lines.reduce((prev, current) => prev.distance > current.distance ? current : prev).line;
            return [line.p1, line.p2];
        }
    }
}

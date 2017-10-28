import { Mouse } from '../mouse.class';
import { Point } from '../../model/point.class';
import { Portal } from '../../model/portal.class';
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

    constructor(protected mouse: Mouse, protected modelSvc: ModelService, public args = {}) {
    }


    public abstract onMouseDown(evt: MouseEvent);

    public abstract onMouseUp(evt: MouseEvent);

    public abstract onMouseMove(evt: MouseEvent);


    protected getFloorPointBelowCursor(exclude?: Point[]): Point {
        return this.floor.getExistingOrThisPoint(new Point(this.mouse.x, this.mouse.y), exclude);
    }

    protected getExistingObjectsBelowCursor(lineAccuracy = 5): {points: Point[], obj: any} {
        const point = this.floor.getExistingOrThisPoint(new Point(this.mouse.x, this.mouse.y), [], true);
        if (point) {
            return {points: [point], obj: null};
        }
        else {
            const lines = ([...this.floor.walls, ...this.floor.portals] as Line[]).map(line => {
                return {
                    distance: this.pointDistance(this.mouse.x, this.mouse.y, line.p1.x, line.p1.y, line.p2.x, line.p2.y),
                    line: line
                };
            });
            const shortest = lines.reduce((prev, current) => prev.distance > current.distance ? current : prev);
            if (shortest.distance <= lineAccuracy) {
                return {points: [shortest.line.p1, shortest.line.p2], obj: shortest.line};
            }
        }
        return {points: [], obj: null};
    }

    private pointDistance(x, y, x1, y1, x2, y2) {
        // calculates distance between point (x, y) and line segment (x1, y1)---(x2, y2)
        // adapted from: https://stackoverflow.com/a/6853926/4464570
        const dot = (x - x1) * (x2 - x1) + (y - y1) * (y2 - y1);
        const len_sq = (x2 - x1) ** 2 + (y2 - y1) ** 2;
        const param = len_sq !== 0 ? dot / len_sq : -1;

        let xx, yy;
        if (param < 0) {
            xx = x1;
            yy = y1;
        }
        else if (param > 1) {
            xx = x2;
            yy = y2;
        }
        else {
            xx = x1 + param * (x2 - x1);
            yy = y1 + param * (y2 - y1);
        }
        return Math.sqrt((x - xx) ** 2 + (y - yy) ** 2);
    }

    protected isSelectable(obj: any) {
        return (obj && obj.id && obj.label !== undefined);
    }
}

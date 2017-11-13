import { Line } from '../../model/line.class';
import { Point } from '../../model/point.class';
import { ModelService } from '../model.service';
import { Mouse } from './mouse.class';

export abstract class Tool {
    public get name() {
        return 'Directions Tool';
    }

    public get icon() {
        return 'select';
    }

    public get cursorShape() {
        return 'pointer';
    }

    protected get floor() {
        return this.modelSvc.currentFloor;
    }

    constructor(protected mouse: Mouse, protected modelSvc: ModelService) {
    }


    public abstract onMouseDown(evt: MouseEvent): void;

    public abstract onMouseUp(evt: MouseEvent): void;

    public abstract onMouseMove(evt: MouseEvent): void;


    protected getFloorPointBelowCursor(exclude?: Point[]): Point {
        return this.floor.getExistingOrThisPoint(new Point(this.mouse.x, this.mouse.y), exclude);
    }

    protected getExistingObjectsBelowCursor(lineAccuracy = 10): {points: Point[], obj: any} {
        const mousePoint = new Point(this.mouse.x, this.mouse.y);
        const linePoint = this.floor.getExistingOrThisPoint(mousePoint, [], true);
        if (linePoint) {
            return {points: [linePoint], obj: null};
        }

        const elevatorPoint = this.floor.getExistingOrThisPoint(mousePoint, [], true,
            this.floor.elevators.map(elevator => elevator.center));
        if (elevatorPoint) {
            return {
                points: [elevatorPoint],
                obj: this.floor.elevators.find(elevator => elevator.center.equals(elevatorPoint))
            };
        }

        const lines = ([...this.floor.walls, ...this.floor.portals, ...this.floor.stairways] as Line[])
            .map(line => ({
                distance: this.pointDistance(this.mouse.x, this.mouse.y, line.p1.x, line.p1.y, line.p2.x, line.p2.y),
                line: line
            }));
        if (lines.length) {
            const shortest = lines.reduce((prev, current) => prev.distance > current.distance ? current : prev);
            if (shortest.distance <= lineAccuracy) {
                return {points: [shortest.line.p1, shortest.line.p2], obj: shortest.line};
            }
        }

        return {points: [], obj: null};
    }

    protected markDirty() {
        this.modelSvc.currentMap.dirty = true;
    }

    private pointDistance(x: number, y: number, x1: number, y1: number, x2: number, y2: number) {
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

}

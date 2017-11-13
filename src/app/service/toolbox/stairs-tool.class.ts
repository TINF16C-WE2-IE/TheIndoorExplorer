import { Point } from '../../model/point.class';
import { Stairs } from '../../model/stairs.class';
import { LineTool } from './line-tool.class';

export class StairsTool extends LineTool {

    public get name() {
        return 'Draw Stairs';
    }

    public get icon() {
        return 'stairs';
    }

    protected createLine(start: Point, end: Point) {
        const stairs = new Stairs('New Stairs', start, this.point);
        this.floor.stairways.push(stairs);
        this.modelSvc.selectedObjects = [stairs];
    }

}

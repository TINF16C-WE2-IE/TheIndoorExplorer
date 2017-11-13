import { Point } from '../../model/point.class';
import { Wall } from '../../model/wall.class';
import { LineTool } from './line-tool.class';

export class WallTool extends LineTool {

    public get name(): string {
        return 'Draw Wall';
    }

    public get icon() {
        return 'wall';
    }

    protected createLine(start: Point, end: Point): void {
        this.floor.walls.push(new Wall(start, this.point));
    }

}

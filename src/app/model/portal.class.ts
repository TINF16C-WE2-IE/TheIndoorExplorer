import { Point } from './point.class';
import { Line } from './line.class';

export class Portal extends Line {
    public id: number;
    public label: string;

    constructor(id: number, label: string, p1: Point, p2: Point) {
        super(p1, p2);
        this.id = id;
        this.label = label;
    }
}

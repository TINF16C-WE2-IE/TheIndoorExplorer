import {Point} from './point.class';
export class Wall {

    public p1: Point;
    public p2: Point;

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
    }
}

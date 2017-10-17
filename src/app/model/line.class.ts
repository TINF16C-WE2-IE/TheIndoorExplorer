import { Point } from './point.class';

export class Line {

    public p1: Point;
    public p2: Point;

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
        this.validate();
    }

    public getPoints() {
        return [this.p1, this.p2];
    }

    public replacePoint(candidate: Point, replacement: Point) {
        if (candidate === this.p1) {
            this.p1 = replacement;
        }
        if (candidate === this.p2) {
            this.p2 = replacement;
        }
        this.validate();
    }

    private validate() {
        if (this.p1.equals(this.p2)) {
            throw new LineEndpointsEqualError(this);
        }
    }
}


export class LineEndpointsEqualError extends Error {
    constructor(public line: Line) {
        super('This line has the same point at both ends: ' + line);
    }
}

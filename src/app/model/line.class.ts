import { Point } from './point.class';

export class Line {

    public p1: Point;
    public p2: Point;

    public deleted: boolean;

    public get center(): Point {
        return new Point((this.p1.x + this.p2.x) / 2, (this.p1.y + this.p2.y) / 2, false);
    }

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
        this.deleted = false;
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
    }

    public isValid() {
        return !this.p1.equals(this.p2);
    }

    public equals(other: Line) {
        return (
            this.p1.equals(other.p1) && this.p2.equals(other.p2)
        ) || (
            this.p1.equals(other.p2) && this.p2.equals(other.p1)
        );
    }

    public forExport() {
        return {p1: this.p1.forExport(), p2: this.p2.forExport()};
    }
}

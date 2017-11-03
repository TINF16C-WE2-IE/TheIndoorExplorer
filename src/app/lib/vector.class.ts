import { Point } from './../model/point.class';

export class Vector extends Point {

    constructor(x: number, y: number) {
        super(x, y, false);
    }

    public static perpendicular(v: Vector): Vector {
        return new Vector(v.y, -v.x);
    }

    public static normalized(v: Vector): Vector {
        const l = v.len();
        return new Vector(v.x /= l, v.y /= l);
    }


    public nor(): void {
        const l = this.len();
        this.x /= l;
        this.y /= l;
    }

    public len(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public angle(): number {

        // why modulo multiple times? Because JavaScript is stupid and returns a negative result on negative number
        return  ((Math.atan2(this.y, this.x) % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
        /*
        return ((Math.atan2(this.y, this.x) >= Math.PI * 2) ?
                    (Math.atan2(this.y, this.x) - Math.PI * 2)
                : (Math.atan2(this.y, this.x) <= Math.PI * -2) ?
                    (Math.atan2(this.y, this.x) + Math.PI * 2)
                    : Math.atan2(this.y, this.x));
                    */
    }
}

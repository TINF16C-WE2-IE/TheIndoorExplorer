import { Point } from './point.class';
import { Portal } from './portal.class';

export class Stairs extends Portal {

    public length: number;
    public canEnter: boolean;
    public canLeave: boolean;

    public get rearCenter(): {x: number, y: number} {
        // cx|cy: center point of portal
        const [cx, cy] = [(this.p1.x + this.p2.x) / 2, (this.p1.y + this.p2.y) / 2];
        // dx|dy: normal vector to portal line (p1-->p2)
        const [dx, dy] = [this.p2.y - this.p1.y, -this.p2.x - this.p1.x];
        return {x: cx + dx, y: cy + dy};
    }

    public get rearLeft(): {x: number, y: number} {
        // dx|dy: normal vector to portal line (p1-->p2)
        const [dx, dy] = [this.p2.y - this.p1.y, -this.p2.x - this.p1.x];
        return {x: this.p1.x + dx, y: this.p1.y + dy};
    }

    public get rearRight(): {x: number, y: number} {
        // dx|dy: normal vector to portal line (p1-->p2)
        const [dx, dy] = [this.p2.y - this.p1.y, -this.p2.x - this.p1.x];
        return {x: this.p2.x + dx, y: this.p2.y + dy};
    }


    constructor(id: number, label: string, p1: Point, p2: Point,
                length: number = 20, canEnter: boolean = true, canLeave: boolean = true) {
        super(id, label, p1, p2);

        this.length = length;
        this.canEnter = canEnter;
        this.canLeave = canLeave;
    }


    public forExport() {
        return Object.assign(super.forExport(), {
            length: this.length,
            canEnter: this.canEnter,
            canLeave: this.canLeave
        });
    }
}

import { Point } from './point.class';
import { Portal } from './portal.class';
import { Floor } from './floor.class';

export class Stairs extends Portal {

    public length: number;
    public canEnter: boolean;
    public canLeave: boolean;
    public target: Stairs;

    public floor: Floor;

    public get width(): number {
        return Math.sqrt((this.p2.x - this.p1.x) ** 2 + (this.p2.y - this.p1.y) ** 2);
    }

    public get prettyName(): string {
        return (this.floor.label || 'Floor ? ') + ': ' + (this.label || 'Unnamed stairs') + ' (' + this.id + ')';
    }

    public get rearCenter(): {x: number, y: number} {
        const norm = this.calcNormalVector();
        return {x: (this.p1.x + this.p2.x) / 2 + norm.x, y: (this.p1.y + this.p2.y) / 2 + norm.y};
    }

    public get rearLeft(): {x: number, y: number} {
        const norm = this.calcNormalVector();
        return {x: this.p1.x + norm.x, y: this.p1.y + norm.y};
    }

    public get rearRight(): {x: number, y: number} {
        const norm = this.calcNormalVector();
        return {x: this.p2.x + norm.x, y: this.p2.y + norm.y};
    }


    constructor(floor: Floor, id: number, label: string, p1: Point, p2: Point, target: Stairs = null,
                canEnter: boolean = true, canLeave: boolean = true, length: number = 30) {
        super(id, label, p1, p2);
        this.target = target;
        this.canEnter = canEnter;
        this.canLeave = canLeave;
        this.length = length;

        this.floor = floor;
    }

    private calcNormalVector(): {x: number, y: number} {
        const [dx, dy] = [this.p2.x - this.p1.x, this.p2.y - this.p1.y];
        const len = Math.sqrt(dx ** 2 + dy ** 2);
        return {x: this.length * dy / len, y: this.length * -dx / len};
    }


    public forExport() {
        return Object.assign(super.forExport(), {
            target: this.target,
            canEnter: this.canEnter,
            canLeave: this.canLeave,
            length: this.length
        });
    }
}

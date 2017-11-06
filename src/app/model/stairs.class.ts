import { Point } from './point.class';
import { Portal } from './portal.class';

export class Stairs extends Portal {

    public length: number;
    public canEnter: boolean;
    public canLeave: boolean;
    public targets: {floorId: number, stairsId: number}[];

    public get width(): number {
        return Math.sqrt((this.p2.x - this.p1.x) ** 2 + (this.p2.y - this.p1.y) ** 2);
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


    constructor(id: number, label: string, p1: Point, p2: Point, targets: {floorId: number, stairsId: number}[] = [],
                canEnter: boolean = true, canLeave: boolean = true, length: number = 30) {
        super(id, label, p1, p2);
        this.targets = targets;
        this.canEnter = canEnter;
        this.canLeave = canLeave;
        this.length = length;
    }

    private calcNormalVector(): {x: number, y: number} {
        const [dx, dy] = [this.p2.x - this.p1.x, this.p2.y - this.p1.y];
        const len = Math.sqrt(dx ** 2 + dy ** 2);
        return {x: this.length * dy / len, y: this.length * -dx / len};
    }


    public forExport() {
        return Object.assign(super.forExport(), {
            targets: this.targets,
            canEnter: this.canEnter,
            canLeave: this.canLeave,
            length: this.length
        });
    }
}

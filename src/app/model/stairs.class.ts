import { Point } from './point.class';
import { Portal } from './portal.class';
import { Selectable } from './selectable.interface';
import { Teleporter } from './teleporter.interface';

export class Stairs extends Portal implements Selectable, Teleporter {

    public length: number;
    public canEnter: boolean;
    public canLeave: boolean;
    public group: number;
    type = 'Stairs';


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


    constructor(label: string, p1: Point, p2: Point, group: number = null,
                canEnter: boolean = true, canLeave: boolean = true, length: number = 30) {
        super(label, p1, p2);
        this.group = group;
        this.canEnter = canEnter;
        this.canLeave = canLeave;
        this.length = length;
    }

    private calcNormalVector(): {x: number, y: number} {
        const [dx, dy] = [this.p2.x - this.p1.x, this.p2.y - this.p1.y];
        const len = Math.sqrt(dx ** 2 + dy ** 2);
        return {
            x: len ? this.length * dy / len : 0,
            y: len ? this.length * -dx / len : 0
        };
    }


    public forExport() {
        return Object.assign(super.forExport(), {
            group: this.group,
            canEnter: this.canEnter,
            canLeave: this.canLeave,
            length: this.length
        });
    }
}

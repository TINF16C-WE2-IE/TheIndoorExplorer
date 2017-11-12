import { Teleporter } from './teleporter.interface';
import { Point } from './point.class';
import { Selectable } from './selectable.interface';

export class Elevator implements Selectable, Teleporter {
    group: number;
    label: string;
    center: Point;

    constructor(label: string, p: Point, group: number = null) {
        this.label = label;
        this.group = group;
        this.center = p;
    }

    public forExport(): {label: string, p: {x: number, y: number}, group: number} {
        return {label: this.label, p: this.center.forExport(), group: this.group};
    }
}

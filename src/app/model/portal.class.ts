import { Point } from './point.class';
import { Line } from './line.class';
import { Selectable } from './selectable.interface';

export class Portal extends Line implements Selectable {
    public label: string;

    constructor(label: string, p1: Point, p2: Point) {
        super(p1, p2);
        this.label = label;
    }

    public forExport() {
        return Object.assign(super.forExport(), {label: this.label});
    }
}

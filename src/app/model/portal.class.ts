import { Point } from './point.class';
import { Line } from './line.class';

export class Portal extends Line implements Selectable {
    public id: number;
    public label: string;

    constructor(id: number, label: string, p1: Point, p2: Point) {
        super(p1, p2);
        this.id = id;
        this.label = label;
    }

    public forExport() {
        return Object.assign(super.forExport(), {id: this.id, label: this.label});
    }
}

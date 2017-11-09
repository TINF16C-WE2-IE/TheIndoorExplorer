import { Point } from './point.class';

export interface Selectable {
    label: string;
    center: Point;
    group?: number;
}

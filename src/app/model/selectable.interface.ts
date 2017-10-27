import { Point } from './point.class';
export interface Selectable {
    id: number;
    label: string;
    center(): Point;
}

import { Point } from './point.class';

export interface Selectable {
    label: string;
    center: Point;
    group?: number;
}


export function isSelectable(obj: Selectable | any): obj is Selectable {
    return (obj && obj.label !== undefined);
}

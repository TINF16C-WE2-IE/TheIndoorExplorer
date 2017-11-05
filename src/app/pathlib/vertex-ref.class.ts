import { enableProdMode } from '@angular/core';
import { Point } from './../model/point.class';
export class VertexRef {

    public previous: VertexRef; // previous point
    public point: Point;        // the vertex
    public next: VertexRef;     // next point in list
    public data: VertexRef;     // neighbour point data (optional)
    public entry_exit: boolean; // some information about intersection (optional)

    constructor(point: Point, next: VertexRef = null, previous: VertexRef = null, data: VertexRef = null, entry_exit = null) {
        this.point = point;
        this.next = next;
        this.previous = previous;
        this.data = data;
        this.entry_exit = entry_exit;
    }
}

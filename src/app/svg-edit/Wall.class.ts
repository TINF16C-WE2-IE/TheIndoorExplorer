import { Vertex } from './Vertex.class';

export class Wall {
    a: Vertex;
    b: Vertex;

    constructor(a: Vertex, b: Vertex) {
        this.a = a;
        this.b = b;
    }
}

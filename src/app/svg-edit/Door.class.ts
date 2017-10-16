import { Wall } from './Wall.class';
import { Vertex } from './Vertex.class';

export class Door extends Wall {
    label: string;
    rooms = [];
    id: number;

    constructor(a: Vertex, b: Vertex) {
        super(a, b);
    }
}

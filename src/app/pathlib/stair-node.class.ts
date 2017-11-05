import { Stairs } from './../model/stairs.class';

export class StairNode {
    public stairs: Stairs;
    public links: StairNode[];
    public costs: number[];
    public floorLevel: number;

    constructor(stairs: Stairs = null, floorLevel: number = 0, links: StairNode[] = [], costs: number[] = []) {
        this.stairs = stairs;
        this.links = links;
        this.floorLevel = floorLevel;
        this.costs = costs;
    }

    public equals(another: StairNode): boolean {
        return this.stairs.equals(another.stairs);
    }
}

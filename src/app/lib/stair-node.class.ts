import { Stairs } from './../model/stairs.class';

export class StairNode {
    public stairs: Stairs;
    public links: StairNode[];
    public costs: number[];

    constructor(stairs: Stairs = null, links: StairNode[] = [], costs: number[] = []) {
        this.stairs = stairs;
        this.links = links;
        this.costs = costs;
    }
}

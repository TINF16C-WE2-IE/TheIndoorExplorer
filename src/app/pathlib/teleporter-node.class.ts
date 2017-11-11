import { Stairs } from '../model/stairs.class';

export class TeleporterNode {
    public stairs: Stairs;
    public links: TeleporterNode[];
    public costs: number[];
    public floorLevel: number;

    constructor(stairs: Stairs = null, floorLevel: number = 0, links: TeleporterNode[] = [], costs: number[] = []) {
        this.stairs = stairs;
        this.links = links;
        this.floorLevel = floorLevel;
        this.costs = costs;
    }

}

import { Teleporter } from './../model/teleporter.interface';

export class TeleporterNode {
    public teleporter: Teleporter;
    public links: TeleporterNode[];
    public costs: number[];
    public floorLevel: number;

    constructor(teleporter: Teleporter = null, floorLevel: number = 0, links: TeleporterNode[] = [], costs: number[] = []) {
        this.teleporter = teleporter;
        this.links = links;
        this.floorLevel = floorLevel;
        this.costs = costs;
    }

}

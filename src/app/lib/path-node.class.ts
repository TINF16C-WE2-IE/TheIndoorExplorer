
// describes a node for pathfinding
export class PathNode {

    public x: number;
    public y: number;
    public links: PathNode[];       // links to other pathnodes
    public costs: number[];     // the cost for every node to move on

    constructor(x: number, y: number, links: PathNode[] = [], costs: number[] = []) {
        this.x = x;
        this.y = y;
        this.links = links;
        this.costs = costs;
    }

    public addLinkTo(n: PathNode, cost: number): void {
        this.links.push(n);
        this.costs.push(cost);
    }
}

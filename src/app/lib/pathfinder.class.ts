import { PathNode } from './path-node.class';

export class Pathfinder {

    constructor() {

    }

    // before calling this, nodes should have been linked together.
    // (and a link has to be registered in BOTH nodes!)
    // additionally, "from" and "to" should have the reference to a node in the given nodes list.
    public findPathFromTo(nodes: PathNode[], from: PathNode, to: PathNode): PathNode[] {

        if (from === to || nodes.indexOf(from) === nodes.indexOf(to)) return [from];

        const resultList = [];
        const openList = [];
        const closedList = [];


        // assign initial costs for nodes
        const costs = new Array();
        for (let n = 0; n < nodes.length; n++) {
            costs.push( nodes[n] === from ? 0 : Number.MAX_VALUE);
        }

        closedList.push(from);
        return this.findPath(nodes, costs, openList, closedList, to);
    }

    private findPath(nodes: PathNode[], costs: number[], openList: PathNode[], closedList: PathNode[], end: PathNode) {
        console.log('at the beginning of the findpath: (nodes, costs, open, closed, end)', nodes, costs, openList, closedList, end);

        let min = Number.MAX_VALUE;
        let curCost = min;
        let minClNode = null;
        let minLinkIndex = -1;
        for (const cl of closedList) {
            for (let j = 0; j < cl.links.length; j++) {
                if (closedList.indexOf(cl.links[j]) < 0) {
                    openList.push(cl.links[j]);
                    curCost = costs[nodes.indexOf(cl)] + cl.costs[j];

                    if (curCost < min) {
                        min = curCost;
                        minClNode = cl;
                        minLinkIndex = j;
                    }
                    costs[nodes.indexOf(cl.links[j])] = curCost;

                    console.log('available next node: from ', cl.x, '/', cl.y, ' to ', cl.links[j].x,
                                  '/', cl.links[j].y, ' cost: ', curCost);
                }
            }
        }

        openList = openList.splice(minClNode.links[minLinkIndex]);
        closedList.push(minClNode.links[minLinkIndex]);

        this.findPath(nodes, costs, openList, closedList, end);
        // now we got all costs.

        return null;
    }

    public debugTest(): void {
        const n1 = new PathNode(100, 100);
        const n2 = new PathNode(120, 100);
        const n3 = new PathNode(240, 200);
        const n4 = new PathNode(100, 360);
        const n5 = new PathNode(110, 370);
        const n6 = new PathNode(346, 600);
        const n7 = new PathNode(300, 550);
        const n8 = new PathNode(500, 440);
        const n9 = new PathNode(550, 200);
        const n10 = new PathNode(600, 100);

        const link = (nn1: PathNode, nn2: PathNode) => {
            const dist = Math.sqrt((nn1.x - nn2.x) * (nn1.x - nn2.x) + (nn1.y - nn2.y) * (nn1.y - nn2.y));
            nn1.addLinkTo(nn2, dist);
            nn2.addLinkTo(nn1, dist);
        };

        link(n1, n2);
        link(n1, n3);
        link(n2, n3);
        link(n1, n4);
        link(n3, n4);
        link(n4, n6);
        link(n1, n6);
        link(n3, n6);
        link(n6, n7);

        this.findPathFromTo([n1, n2, n3, n4, n5, n6, n7, n8, n9, n10], n1, n7);
    }
}

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
        this.calculateCosts(nodes, costs, openList, closedList, to);

        // todo. based on costs, search for optimal path.

        return null;
    }

    private calculateCosts(nodes: PathNode[], costs: number[], openList: PathNode[], closedList: PathNode[], end: PathNode): number[] {
        console.log('at the beginning of the findpath: (nodes, costs, open, closed, end)',
                      nodes, costs, openList, closedList, end);

        let min = Number.MAX_VALUE;
        let curCost = min;
        let minClNode = null;
        let minLinkIndex = -1;
        for (const cl of closedList) {
            for (let j = 0; j < cl.links.length; j++) {


                // calculate cost
                curCost = costs[nodes.indexOf(cl)] + cl.costs[j];

                // take over the minimal cost
                if (curCost < costs[nodes.indexOf(cl.links[j])]) {
                    costs[nodes.indexOf(cl.links[j])] = curCost;
                }


                if (closedList.indexOf(cl.links[j]) < 0) {

                    // add node to openlist, if necessary
                    if (openList.indexOf(cl.links[j]) < 0) {
                        openList.push(cl.links[j]);
                    }

                    // select the global path with minimal cost DEPRECTAED maybe
                    if (curCost < min) {
                        min = curCost;
                        minClNode = cl;
                        minLinkIndex = j;
                    }

                    console.log('available next node: from ', cl.x, '/', cl.y, ' to ', cl.links[j].x,
                                  '/', cl.links[j].y, ' cost: ', curCost);
                }
            }
        }

        console.log('before: (open, closed)', openList, closedList);
        openList = openList.splice(openList.indexOf(minClNode.links[minLinkIndex]), 1);
        closedList.push(minClNode.links[minLinkIndex]);
        console.log('after: (open, closed)', openList, closedList);

        if (openList.length > 0 && closedList.indexOf(end) < 0) {
            this.calculateCosts(nodes, costs, openList, closedList, end);
        } else {
            console.log('got your cost calculation. (nodes, costs, closed, open, end)', nodes, costs, closedList, openList, end);
        }
        // now we got all costs.

        return costs;
    }

    public debugTest(): void {
        const n1 = new PathNode(100, 100);
        const n2 = new PathNode(200, 200);
        const n3 = new PathNode(300, 300);
        const n4 = new PathNode(400, 400);
        const n5 = new PathNode(500, 500);
        const n6 = new PathNode(600, 600);
        const n7 = new PathNode(700, 700);
        const n8 = new PathNode(800, 800);
        const n9 = new PathNode(900, 900);
        const n10 = new PathNode(1000, 1000);

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

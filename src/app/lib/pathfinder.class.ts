import { PathNode } from './path-node.class';

export class Pathfinder {

    constructor() {

    }

    // before calling this, nodes should have been linked together.
    // (and a link has to be registered in BOTH nodes!)
    // additionally, "from" and "to" should have the reference to a node in the given nodes list.
    public findPathFromTo(nodes: PathNode[], from: PathNode, to: PathNode): PathNode[] {

        if (from === to || nodes.indexOf(from) === nodes.indexOf(to)) return [from];

        // open/closed nodes for pathfinding
        const openList = [];
        const closedList = [];


        // assign initial costs for nodes, and create their parents for backtracking the best path.
        const costs = new Array();
        const parents = new Array();
        for (let n = 0; n < nodes.length; n++) {
            costs.push( nodes[n] === from ? 0 : Number.MAX_VALUE);
            parents.push(nodes[n]);
        }
        closedList.push(from);

        console.log('pathfinder is calculating the best path over linked nodes. (nodes, from, to)', nodes, from, to);
        return this.calculatePath(nodes, costs, parents, openList, closedList, to);
    }

    private calculatePath(nodes: PathNode[], costs: number[], parents: PathNode[],
                            openList: PathNode[], closedList: PathNode[], end: PathNode): PathNode[] {

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
                    parents[nodes.indexOf(cl.links[j])] = cl;
                }


                if (closedList.indexOf(cl.links[j]) < 0) {

                    // add node to openlist, if necessary
                    if (openList.indexOf(cl.links[j]) < 0) {
                        openList.push(cl.links[j]);
                    }

                    // from all the open links, select the best link with minimal cost
                    if (curCost < min) {
                        min = curCost;
                        minClNode = cl;
                        minLinkIndex = j;
                    }
                }
            }
        }

        openList = openList.splice(openList.indexOf(minClNode.links[minLinkIndex]), 1);
        closedList.push(minClNode.links[minLinkIndex]);

        if (openList.length > 0 && closedList.indexOf(end) < 0) {
            return this.calculatePath(nodes, costs, parents, openList, closedList, end);
        } else {

            // got the costs over the nodes. now back-track.
            // start at end node and backtrack over the parent for each node.
            // while the last node in backtracking-path has a valid parent (means: not themselves), go on.
            const resultPath = new Array();
            resultPath.push(end);
            while (parents[nodes.indexOf(resultPath[resultPath.length - 1])] !== resultPath[resultPath.length - 1]) {
                resultPath.push(parents[nodes.indexOf(resultPath[resultPath.length - 1])]);
            }
            resultPath.reverse();
            return resultPath;
        }
    }

    public debugTest(): void {
        const n1 = new PathNode(100, 100);
        const n2 = new PathNode(200, 200);
        const n3 = new PathNode(300, 500);
        const n4 = new PathNode(400, 400);
        const n5 = new PathNode(500, 500);
        const n6 = new PathNode(600, 600);
        const n7 = new PathNode(200, 100);
        const n8 = new PathNode(800, 800);
        const n9 = new PathNode(900, 900);
        const n10 = new PathNode(1000, 1000);

        const link = (nn1: PathNode, nn2: PathNode) => {
            const dist = Math.sqrt((nn1.x - nn2.x) * (nn1.x - nn2.x) + (nn1.y - nn2.y) * (nn1.y - nn2.y));
            nn1.addLinkTo(nn2, dist);
            nn2.addLinkTo(nn1, dist);
        };

        // creates a simple path with 2 shortcuts (1<->4, 4<->7 and 3<->7)
        link(n1, n2);
        link(n2, n3);
        link(n3, n4);
        link(n4, n5);
        link(n5, n6);
        link(n6, n7);
        link(n1, n4);
        link(n3, n7);
        link(n4, n7);

        // in this special example: pathfinder should take the path over 1-4-7
        // because due to shortcuts, its faster than moving over 1-2-3-7.

        console.log('path-result: ', this.findPathFromTo([n1, n2, n3, n4, n5, n6, n7, n8, n9, n10], n1, n7));
    }
}

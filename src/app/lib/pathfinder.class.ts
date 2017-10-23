import { PathNode } from '../model/path-node.class';

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
            while (!parents[nodes.indexOf(resultPath[resultPath.length - 1])].equals(resultPath[resultPath.length - 1])) {
                resultPath.push(parents[nodes.indexOf(resultPath[resultPath.length - 1])]);
            }
            resultPath.reverse();
            return resultPath;
        }
    }

    // TODO: simple grid based approach
    public createLinkedGraph(): PathNode[] {
        return null;
    }

    // TODO:
    // advanced approach, not fully completed yet.
    public createAdvancedLinkGraph(walls: any[], radius: number): PathNode[] {

        // result
        const pathNodes: PathNode[] = new Array();

        // keep track of links, we already checked.
        const chckd: {p1: number, p2: number}[] = [];



        // create nodes in a offset(radius) around every wall.
        for (const w of walls) {

            // create some vectors.
            const v = {x: (w.p2.x - w.p1.x) / 2, y: (w.p2.y - w.p1.y) / 2}; // half of vector p2-p1
            const vlength = Math.sqrt(v.x * v.x + v.y * v.y);               // length
            const v0 = {x: v.x / vlength, y: v.y / vlength};                // normalized

            const vn = {x: -v.y, y: v.x};                             // perpendicular vector to v
            const vnlength = Math.sqrt(vn.x * vn.x + vn.y * vn.y);
            const vn0 = {x: vn.x / vnlength, y: vn.y / vnlength};

            const centerCoord = {x: w.p1.x + v0.x * vlength, y: w.p1.y + v0.y * vlength};
            const p1 = new PathNode(
                centerCoord.x + v0.x * (vlength + radius) + vn0.x * (radius),
                centerCoord.y + v0.y * (vlength + radius) + vn0.y * (radius)
            );
            const p2 = new PathNode(
                centerCoord.x + v0.x * (vlength + radius) - vn0.x * (radius),
                centerCoord.y + v0.y * (vlength + radius) - vn0.y * (radius)
            );
            const p3 = new PathNode(
                centerCoord.x - v0.x * (vlength + radius) - vn0.x * (radius),
                centerCoord.y - v0.y * (vlength + radius) - vn0.y * (radius)
            );
            const p4 = new PathNode(
                centerCoord.x - v0.x * (vlength + radius) + vn0.x * (radius),
                centerCoord.y - v0.y * (vlength + radius) + vn0.y * (radius)
            );

            this.linkNodes(p1, p2);
            this.linkNodes(p2, p3);
            this.linkNodes(p3, p4);
            this.linkNodes(p4, p1);
            pathNodes.push(p1, p2, p3, p4);

            chckd.push({p1: pathNodes.length - 4, p2: pathNodes.length - 3}, {p1: pathNodes.length - 3, p2: pathNodes.length - 4});
            chckd.push({p1: pathNodes.length - 3, p2: pathNodes.length - 2}, {p1: pathNodes.length - 2, p2: pathNodes.length - 3});
            chckd.push({p1: pathNodes.length - 2, p2: pathNodes.length - 1}, {p1: pathNodes.length - 1, p2: pathNodes.length - 2});
            chckd.push({p1: pathNodes.length - 1, p2: pathNodes.length - 4}, {p1: pathNodes.length - 4, p2: pathNodes.length - 1});

            console.log('created nodes of wall', w, [p1, p2, p3, p4]);
        }

        // now, all 4 nodes around each wall are linked to their neighbour.
        // we now have to link nodes interchangeably between the walls.

        for (let i = 0; i < pathNodes.length; i++) {
            for (let j = 0; j < pathNodes.length; j++) {

                // go on if the link already exists or we are looking on the same node.
                if (chckd.find(element => element.p1 === i && element.p2 === j) !== undefined
                    || i === j) {
                    continue;
                }

                // we need again a vector from each wall, to check if this node-link interfers with any other wall-line.
                const vLink = {x: (pathNodes[j].x - pathNodes[i].x), y: (pathNodes[j].y - pathNodes[i].y)};
                let intersects = false;
                for (const w of walls) {
                    const vWall = {x: w.p2.x - w.p1.x, y: w.p2.y - w.p1.y};

                    // find the parameter values (s, t) for the intersection point of theese 2 lines
                    const s = ( -vLink.y * (pathNodes[i].x - w.p1.x)
                                + vLink.x * (pathNodes[i].y - w.p1.y))
                              / (-vWall.x * vLink.y + vLink.x * vWall.y);
                    const t = ( vWall.x * (pathNodes[i].y - w.p1.y)
                                - vWall.y * (pathNodes[i].x - w.p1.x))
                              / (-vWall.x * vLink.y + vLink.x * vWall.y);

                    if (s > 0 && s < 1 && t > 0 && t < 1) {
                        intersects = true;
                        break;
                    }
                }

                if (intersects) {
                    continue;
                }


                // TODO: decide based on the angles if this link is worth having it.
                // now we know this link doesnt intersect with a wall. and we didnt check this link yet.
                // -> calculate angles to determine, if this link is worth having it.
                const d = Math.sqrt((pathNodes[i].x - pathNodes[j].x) * (pathNodes[i].x - pathNodes[j].x) +
                                      (pathNodes[i].y - pathNodes[j].y) * (pathNodes[i].y - pathNodes[j].y));
                const ang1 = Math.acos( (pathNodes[i].x - pathNodes[j].x) / d );
                console.log('checking link between ', pathNodes[i], pathNodes[j], i, j, ' calculated: ', d, ang1);

                // get the main angle between p2 and p1.
                Math.atan2(pathNodes[j].y - pathNodes[i].y, pathNodes[j].x - pathNodes[i].x);



                // and add this link to the checked list.
                chckd.push({p1: i, p2: j}, {p1: j, p2: i});
            }
        }

        console.error('creating a linked node-graph from map doesnt work yet. TODO.');
        return null;
    }

    public linkTest(): void {
        const walls = [
            {
                p1: { x: 5, y: 5 },
                p2: { x: 15, y: 5 }
            },
            {
                p1: { x: 10, y: 15 },
                p2: { x: 10, y: 20 }
            },
        ];
        this.createAdvancedLinkGraph(walls, 2);
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

        // creates a simple path with 2 shortcuts (1<->4, 4<->7 and 3<->7)
        this.linkNodes(n1, n2);
        this.linkNodes(n2, n3);
        this.linkNodes(n3, n4);
        this.linkNodes(n4, n5);
        this.linkNodes(n5, n6);
        this.linkNodes(n6, n7);
        this.linkNodes(n1, n4);
        this.linkNodes(n3, n7);
        this.linkNodes(n4, n7);

        // in this special example: pathfinder should take the path over 1-4-7
        // because due to shortcuts, its faster than moving over 1-2-3-7.

        console.log('path-result: ', this.findPathFromTo([n1, n2, n3, n4, n5, n6, n7, n8, n9, n10], n1, n7));
    }

    public linkNodes (nn1: PathNode, nn2: PathNode): void {
        const dist = Math.sqrt((nn1.x - nn2.x) * (nn1.x - nn2.x) + (nn1.y - nn2.y) * (nn1.y - nn2.y));
        nn1.addLinkTo(nn2, dist);
        nn2.addLinkTo(nn1, dist);
    }
}

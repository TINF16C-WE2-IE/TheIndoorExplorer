import { Vector } from './vector.class';
import { VertexRef } from './vertex-ref.class';
import { Polygon } from './polygon.class';
import { Line } from './../model/line.class';
import { Wall } from './../model/wall.class';
import { Point } from './../model/point.class';
import { PathNode } from './path-node.class';

export class Pathfinder2 {

    // mainly just for debugging
    public connections: Line[];

    constructor() {
        this.connections = [];
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

    private checkIntersectionOfLineWithLines(p1x, p1y, p2x, p2y, lines: Line[], endpointTolerance: number,
                                              debug: boolean = false): boolean {

        let intersects = false;
        for (const w of lines) {
            const vWall = {x: w.p2.x - w.p1.x, y: w.p2.y - w.p1.y};

            // find the parameter values (s, t) for the intersection point of theese 2 lines
            const s = ( -(p2y - p1y) * (p1x - w.p1.x)
                        + (p2x - p1x) * (p1y - w.p1.y))
                      / (-vWall.x * (p2y - p1y) + (p2x - p1x) * vWall.y);
            const t = ( vWall.x * (p1y - w.p1.y)
                        - vWall.y * (p1x - w.p1.x))
                      / (-vWall.x * (p2y - p1y) + (p2x - p1x) * vWall.y);

            if (s >= 0 + endpointTolerance && s <= 1 - endpointTolerance && t >= 0 + endpointTolerance && t <= 1 - endpointTolerance) {
                intersects = true;
                break;
            }
        }

        return intersects;
    }

    private createNodesForWallEnd(p1: Point, p2: Point, radius: number, walls: Line[], numResolution: number): PathNode[] {

        const nodes: PathNode[] = [];

        // walls, merging at that point
        const neighbours: {v: Vector, a: number}[] = [];
        const ang = new Vector(p2.x - p1.x, p2.y - p1.y).angle();

        // loop through lines with the same endpoint as p1 and create vectors
        for (const l of walls.filter(el => el.p2.equals(p1) || el.p1.equals(p1))) {
            const vv = (l.p1.equals(p1) ? new Vector(l.p2.x - l.p1.x, l.p2.y - l.p1.y)
                                          : new Vector(l.p1.x - l.p2.x, l.p1.y - l.p2.y));
            vv.nor();
            neighbours.push({v: vv, a: vv.angle()});
        }

        neighbours.sort((a, b) => (b.a - a.a));
        for (let n = 0; n < neighbours.length; n++) {

            let nextAng = neighbours[(n + 1) % (neighbours.length)].a;
            if (n === neighbours.length - 1) nextAng += Math.PI * 2;


            for (let b = 0; b < numResolution; b++) {
                let midAng = nextAng + ((neighbours[n].a - nextAng) / (numResolution + 1)) * (b + 1);

                // mirror the angle if the next neighbour has exactly the same angle!
                if (midAng === neighbours[n].a) {
                    midAng = (midAng + Math.PI) % Math.PI * 2;
                }

                const midV = new Vector(Math.cos(midAng) * radius, Math.sin(midAng) * radius);
                nodes.push(new PathNode(p1.x + midV.x, p1.y + midV.y));
            }
        }

        return nodes;
    }


    // advanced approach: more complex in preparation, but less nodes, so cheaper for path finding.
    public createLinkedGraph(walls: Line[], radius: number, resolution: number = 2, start: Point = null, end: Point = null): PathNode[] {


        // total nodes list
        const nodes: PathNode[] = [];
        this.connections = [];

        // checked-links list, which contains checked links, but theese links were not worth it
        const chckd: Line[] = [];

        // checked-links list, which contains checked points, which we generated nodes for.
        const chckdP: Point[] = [];

        // first, search for all endpoints and creates node around them.
        for (const w of walls) {

            if (chckdP.find(el => el.equals(w.p1)) === undefined) {
                nodes.push(...this.createNodesForWallEnd(w.p1, w.p2, radius, walls, resolution));
                chckdP.push(w.p1);
            }

            if (chckdP.find(el => el.equals(w.p2)) === undefined) {
                nodes.push(...this.createNodesForWallEnd(w.p2, w.p1, radius, walls, resolution));
                chckdP.push(w.p2);
            }
        }

        // connect the nodes
        for (const n1 of nodes) {
            for (const n2 of nodes) {

                if (n1 !== n2) {
                    // check for any link between the nodes


                            // move onto the next, in case we already checked this link.
                            if (chckd.find(el =>
                                (el.p1.x === n1.x && el.p1.y === n1.y && el.p2.x === n2.x && el.p2.y === n2.y)
                                || (el.p1.x === n2.x && el.p1.y === n2.y && el.p2.x === n1.x && el.p2.y === n1.y)) === undefined) {

                                const p1 = new Point(n1.x, n1.y, false);
                                const p2 = new Point(n2.x, n2.y, false);

                                // if this link doesnt intersect any walls
                                if (!this.checkIntersectionOfLineWithLines(
                                        n1.x, n1.y, n2.x, n2.y, walls, 0.0)
                                ) {
                                    this.linkNodes(
                                        nodes.find(el => el.x === n1.x && el.y === n1.y),
                                        nodes.find(el => el.x === n2.x && el.y === n2.y)
                                    );
                                    this.connections.push(new Line(p1, p2));
                                } else {

                                    // just and mark as checked.
                                    chckd.push(new Line(p1, p2));
                                }
                            } else {
                                // already checked.
                            }

                } else {
                    // dont check the same node.
                }
            }
        }


        // at last but not least, connect the start point to visible nodes!
        if (start !== null && start !== undefined) {
            if (start !== undefined && start !== null) {
                const startn = new PathNode(start.x, start.y);
                nodes.push(startn);
                for (const n of nodes) {

                // if this link doesnt intersect any "polygon-borders" (connections)
                if (!this.checkIntersectionOfLineWithLines(
                        start.x, start.y, n.x, n.y, walls, 0.01)
                ) {

                        // we need this link!
                        this.linkNodes(startn, n);
                        this.connections.push(new Line(start, new Point(n.x, n.y, false)));
                    }
                }
            }
        }

        // also connect endpoint
        if (end !== undefined && end !== null) {
            const endn = new PathNode(end.x, end.y);
            nodes.push(endn);
                for (const n of nodes) {

                // if this link doesnt intersect any "polygon-borders" (connections)
                if (!this.checkIntersectionOfLineWithLines(
                        end.x, end.y, n.x, n.y, walls, 0.01)
                ) {
                        // we need this link!
                        this.linkNodes(endn, n);
                        this.connections.push(new Line(end, new Point(n.x, n.y, false)));
                    }
                }
        }

        return nodes;
    }

    public linkNodes (nn1: PathNode, nn2: PathNode): void {
        const dist = Math.sqrt((nn1.x - nn2.x) * (nn1.x - nn2.x) + (nn1.y - nn2.y) * (nn1.y - nn2.y));
        nn1.addLinkTo(nn2, dist);
        nn2.addLinkTo(nn1, dist);
    }
}

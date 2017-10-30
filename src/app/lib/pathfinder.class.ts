import { VertexRef } from './vertex-ref.class';
import { Polygon } from './polygon.class';
import { Line } from './../model/line.class';
import { Wall } from './../model/wall.class';
import { Point } from './../model/point.class';
import { PathNode } from './path-node.class';

export class Pathfinder {

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

    private checkIntersectionOfLineWithLines(p1x, p1y, p2x, p2y, lines: Line[], includeEndpoints = true): boolean {

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

            if (includeEndpoints ? (s >= 0 && s <= 1 && t >= 0 && t <= 1) : (s > 0 && s < 1 && t > 0 && t < 1) ) {
                intersects = true;
                break;
            }
        }

        return intersects;
    }

    private createPolygonsFromLines(ls: Line[], radius: number): Polygon[] {
        // we create polygons around the lines with given radius.
        // joining (union) intersecting polygons.

        // keep track of node-polygons
        let nodePolygons: Polygon[] = [];


        // create nodes in an offset(radius) around every wall.
        for (const w of ls) {

            // create some vectors.
            const v = {x: (w.p2.x - w.p1.x) / 2, y: (w.p2.y - w.p1.y) / 2}; // half of vector p2-p1
            const vlength = Math.sqrt(v.x * v.x + v.y * v.y);               // length
            const v0 = {x: v.x / vlength, y: v.y / vlength};                // normalized

            const vn = {x: -v.y, y: v.x};                             // perpendicular vector to v
            const vnlength = Math.sqrt(vn.x * vn.x + vn.y * vn.y);
            const vn0 = {x: vn.x / vnlength, y: vn.y / vnlength};

            const centerCoord = {x: w.p1.x + v0.x * vlength, y: w.p1.y + v0.y * vlength};
            const p1 = new VertexRef(new Point(
                centerCoord.x + v0.x * (vlength + radius) + vn0.x * (radius),
                centerCoord.y + v0.y * (vlength + radius) + vn0.y * (radius), false
            ));
            /*
            const p2 = new VertexRef(new Point(
                centerCoord.x + v0.x * (vlength + radius * 1.5),
                centerCoord.y + v0.y * (vlength + radius * 1.5), false
            ));
            */
            const p3 = new VertexRef(new Point(
                centerCoord.x + v0.x * (vlength + radius) - vn0.x * (radius),
                centerCoord.y + v0.y * (vlength + radius) - vn0.y * (radius), false
            ));
            const p4 = new VertexRef(new Point(
                centerCoord.x - v0.x * (vlength + radius) - vn0.x * (radius),
                centerCoord.y - v0.y * (vlength + radius) - vn0.y * (radius), false
            ));
            /*
            const p5 = new VertexRef(new Point(
                centerCoord.x - v0.x * (vlength + radius * 1.5),
                centerCoord.y - v0.y * (vlength + radius * 1.5), false
            ));
            */
            const p6 = new VertexRef(new Point(
                centerCoord.x - v0.x * (vlength + radius) + vn0.x * (radius),
                centerCoord.y - v0.y * (vlength + radius) + vn0.y * (radius), false
            ));

            p1.next = p3; p1.previous = p6;
            /*p2.next = p3; p2.previous = p1;*/
            p3.next = p4; p3.previous = p1;
            p4.next = p6; p4.previous = p3;
            /*p5.next = p6; p5.previous = p4;*/
            p6.next = p1; p6.previous = p4;

            nodePolygons.push(new Polygon(p1));
            if (nodePolygons.length >= 2) {
                for (let i = 0; i < nodePolygons.length - 1; i++) {
                    nodePolygons.splice(i, 2, ...nodePolygons[i].union(nodePolygons[i + 1]));
                }
            }
        }

        console.log('created node polygons', nodePolygons);

        return nodePolygons;
    }


    // advanced approach: more complex in preparation, but less nodes, so cheaper for path finding.
    public createLinkedGraph(walls: any[], radius: number, start: Point = null, end: Point = null): PathNode[] {

        const polygons = this.createPolygonsFromLines(walls, radius);

        // total nodes list
        const nodes: PathNode[] = [];
        this.connections = [];

        for (const vv of polygons) {

            let prevNode = null;
            let first = null;
            let ref = vv.vertex;
            do {

                this.connections = this.connections.concat(new Line(ref.point, ref.next.point));
                const nn = new PathNode(ref.point.x, ref.point.y);
                if (first === null) {
                    first = nn;
                }
                nodes.push(nn);
                if (prevNode !== null) {
                    this.linkNodes(nn, prevNode);
                }

                prevNode = nn;
                ref = ref.next;
            } while (ref !== vv.vertex);

            // link one last time
            this.linkNodes(first, prevNode);
        }

        console.log(nodes);
        return nodes;
        // TODO: we need all border-lines of the polygons

        /*

        for (const np of polygons) {
            for (const npl of polygons) {

                // check for any link between the nodes of np and npl
                for (let i = 0; i < np.lines.length; i++) {
                    for (let j = 0; j < npl.lines.length; j++) {

                        // move onto the next, in case we already checked this link.
                        if (chckd.find(element =>
                            (element.n1x === np.lines[i].p1.x && element.n1y === np.lines[i].p1.y
                              && element.n2x === npl.lines[j].p1.x && element.n2y === npl.lines[j].p1.y)
                            || (element.n1x === npl.lines[j].p1.x && element.n1y === npl.lines[j].p1.y
                              && element.n2x === np.lines[i].p1.x && element.n2y === np.lines[i].p1.y)) !== undefined) {
                            continue;
                        }

                        // if this link doesnt intersect any "polygon-links"
                        if (nodePolygons.every(element => {
                            return !this.checkIntersectionOfLineWithLines(
                                np.lines[i].p1.x, np.lines[i].p1.y, npl.lines[j].p1.x, npl.lines[j].p1.y,
                                element.lines.concat(walls), false);
                        })) {
                            if (this.checkIfLinkIsWorthIt(
                                    np.lines[i].p1,
                                    npl.lines[j].p1,
                                    np.lines[(i === 0) ? (np.lines.length - 1) : (i - 1)].p1,
                                    np.lines[(i === np.lines.length - 1) ? (0) : (i + 1)].p1,
                                    npl.lines[(j === 0) ? (npl.lines.length - 1) : (j - 1)].p1,
                                    npl.lines[(j === npl.lines.length - 1) ? (0) : (j + 1)].p1
                            )) {

                                // check if this link is worth having it. based on angles of their neighbour walls

                                // we need this link!
                                this.linkNodes(
                                    nodes.find(el => el.x === np.lines[i].p1.x && el.y === np.lines[i].p1.y),
                                    nodes.find(el => el.x === npl.lines[j].p1.x && el.y === npl.lines[j].p1.y)
                                );

                                // mainly just for debug
                                this.connections.push(new Line(np.lines[i].p1, npl.lines[j].p1));
                            }
                        } else {

                        }

                        // and mark as checked.
                        chckd.push({n1x: np.lines[i].p1.x, n1y: np.lines[i].p1.y, n2x: npl.lines[j].p1.x, n2y: npl.lines[j].p1.y});
                    }
                }
            }
        }


        // at last but not least, connect the start point to visible nodes!
        if (start !== undefined && start !== null) {
            const startn = new PathNode(start.x, start.y);
            nodes.push(startn);
            for (const n of nodes) {

                do {

                } while
                if (polygons.every(element => {
                    return !this.checkIntersectionOfLineWithLines(
                        start.x, start.y, n.x, n.y, new Lin.concat(walls), false);
                })) {
                    this.linkNodes(startn, n);

                    // mainly just for debug
                    this.connections.push(new Line(start, new Point(n.x, n.y, false)));
                }
            }
        }

        // also connect endpoint
        if (end !== undefined && end !== null) {
            const endn = new PathNode(end.x, end.y);
            nodes.push(endn);
            for (const n of nodes) {
                if (nodePolygons.every(element => {
                    return !this.checkIntersectionOfLineWithLines(
                        end.x, end.y, n.x, n.y, element.lines.concat(walls), false);
                })) {
                    this.linkNodes(endn, n);

                    // mainly just for debug
                    this.connections.push(new Line(end, new Point(n.x, n.y, false)));
                }
            }
        }

        return nodes;
        */
    }

    // @params arguments are the 2 nodes, and then the 2 neighbour nodes of the first (before, after),
    // then the 2 neighbour nodes for the second one (before, after).
    private checkIfLinkIsWorthIt(p1: Point, p2: Point, p1prev: Point, p1next: Point, p2prev: Point, p2next: Point): boolean {

        if ((p1.x === p1next.x && p1next.x === p1prev.x && p1.y === p1next.y && p1next.y === p1prev.y)
            && (p2.x === p2next.x && p2next.x === p2prev.x && p2.y === p2next.y && p2next.y === p2prev.y)) {
            return true;
        }

        // get some vectors and angles
        const nodeAng = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        let ang11 = nodeAng - Math.atan2(p2next.y - p1.y, p2next.x - p1.x);
        let ang12 = nodeAng - Math.atan2(p2prev.y - p1.y, p2prev.x - p1.x);
        let ang21 = nodeAng - Math.atan2(p1next.y - p2.y, p1next.x - p2.x);
        let ang22 = nodeAng - Math.atan2(p1prev.y - p2.y, p1prev.x - p2.x);

        if (ang11 >= Math.PI) ang11 -= Math.PI * 2;
        else if (ang11 <= -Math.PI) ang11 += Math.PI * 2;
        if (ang12 >= Math.PI) ang12 -= Math.PI * 2;
        else if (ang12 <= -Math.PI) ang12 += Math.PI * 2;
        if (ang21 >= Math.PI) ang21 -= Math.PI * 2;
        else if (ang21 <= -Math.PI) ang21 += Math.PI * 2;
        if (ang22 >= Math.PI) ang22 -= Math.PI * 2;
        else if (ang22 <= -Math.PI) ang22 += Math.PI * 2;

        return Math.sign(ang11) === Math.sign(ang12) && Math.sign(ang21) === Math.sign(ang22);
    }

    public linkNodes (nn1: PathNode, nn2: PathNode): void {
        const dist = Math.sqrt((nn1.x - nn2.x) * (nn1.x - nn2.x) + (nn1.y - nn2.y) * (nn1.y - nn2.y));
        nn1.addLinkTo(nn2, dist);
        nn2.addLinkTo(nn1, dist);
    }
}

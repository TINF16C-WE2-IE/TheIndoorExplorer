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

    // simple grid based approach
    public createLinkedGraph(threshold, rectEditorWidth, rectEditorHeight, lines: Line[]): PathNode[] {


        const numX = ((rectEditorWidth - threshold) / threshold + 1);
        const numY = ((rectEditorHeight - threshold) / threshold + 1);
        const pathNodes = [];

        // create pathnodes and link them to left and up, in case the links dont intersect a wall.
        for (let j = 0; j < numY; j++) {
            for (let i = 0; i < numX; i++) {
                const x = i * threshold + threshold / 2;
                const xb = (i - 1) * threshold + threshold / 2;
                const y = j * threshold + threshold / 2;
                const yb = (j - 1) * threshold + threshold / 2;
                pathNodes.push(new PathNode(x, y));

                if (i > 0) {
                    if (!this.checkIntersectionOfLineWithLines(xb, y, x, y, lines)) {
                        this.linkNodes(
                            pathNodes.find(element => element.x === x && element.y === y),
                            pathNodes.find(element => element.x === xb && element.y === y),
                        );
                    }
                }
                if (j > 0) {
                    if (!this.checkIntersectionOfLineWithLines(x, yb, x, y, lines)) {
                        this.linkNodes(
                            pathNodes.find(element => element.x === x && element.y === y),
                            pathNodes.find(element => element.x === x && element.y === yb),
                        );
                    }
                }
            }
        }

        return pathNodes;
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




    // advanced approach: more complex in preparation, but less nodes, so cheaper for path finding.
    public createAdvancedLinkedGraph(walls: any[], radius: number): PathNode[] {

        // keep track of node-polygons
        const nodePolygons: {lines: Line[]}[] = [];

        // total nodes list
        const nodes: PathNode[] = [];

        // keep track of already checked links between two node-polygons
        const chckd: {n1x: number, n1y: number, n2x: number, n2y: number}[] = [];



        // create nodes in an offset(radius) around every wall.
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

            // for every polygon(walls) link the surrounding nodes and set them as checked
            this.linkNodes(p1, p2);
            this.linkNodes(p2, p3);
            this.linkNodes(p3, p4);
            this.linkNodes(p4, p1);
            nodes.push(p1, p2, p3, p4);
            nodePolygons.push({ lines: [
                new Line(new Point(p1.x, p1.y, false), new Point(p2.x, p2.y, false)),
                new Line(new Point(p2.x, p2.y, false), new Point(p3.x, p3.y, false)),
                new Line(new Point(p3.x, p3.y, false), new Point(p4.x, p4.y, false)),
                new Line(new Point(p4.x, p4.y, false), new Point(p1.x, p1.y, false))
            ]});
        }

        for (const np of nodePolygons) {

            // mainly just for debug
            this.connections = this.connections.concat(np.lines);

            for (const npl of nodePolygons) {

                // dont connect links on the same polygon. we already have them
                // BEWARE: this approach here only works with CONVEX shapes.
                // if they are concav, there would be truly more connections on the same polygon!
                if (np === npl
                      || np.lines.find(
                          el => npl.lines.find(
                              (elm => elm.p1 === el.p2 || elm.p2 === el.p1)
                          ) !== undefined)
                      !== undefined) {

                    continue;
                }

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
                                np.lines[i].p1.x, np.lines[i].p1.y, npl.lines[j].p1.x, npl.lines[j].p1.y, element.lines, false);
                        })) {

                            // check if this link is worth having it. based on angles of their neighbour walls

                            // get some vectors and angles
                            const nodeAng = Math.atan2(npl.lines[j].p1.y - np.lines[i].p1.y, npl.lines[j].p1.x - np.lines[i].p1.x);
                            let ang11 = nodeAng - Math.atan2(
                              npl.lines[(j === npl.lines.length - 1) ? (0) : (j + 1)].p1.y - np.lines[i].p1.y,
                              npl.lines[(j === npl.lines.length - 1) ? (0) : (j + 1)].p1.x - np.lines[i].p1.x);
                            let ang12 = nodeAng - Math.atan2(
                              npl.lines[(j === 0) ? (npl.lines.length - 1) : (j - 1)].p1.y - np.lines[i].p1.y,
                              npl.lines[(j === 0) ? (npl.lines.length - 1) : (j - 1)].p1.x - np.lines[i].p1.x);
                            let ang21 = nodeAng - Math.atan2(
                              np.lines[(i === np.lines.length - 1) ? (0) : (i + 1)].p1.y - npl.lines[j].p1.y,
                              np.lines[(i === np.lines.length - 1) ? (0) : (i + 1)].p1.x - npl.lines[j].p1.x);
                            let ang22 = nodeAng - Math.atan2(
                              np.lines[(i === 0) ? (np.lines.length - 1) : (i - 1)].p1.y - npl.lines[j].p1.y,
                              np.lines[(i === 0) ? (np.lines.length - 1) : (i - 1)].p1.x - npl.lines[j].p1.x);

                            if (ang11 >= Math.PI) ang11 -= Math.PI * 2;
                            else if (ang11 <= -Math.PI) ang11 += Math.PI * 2;
                            if (ang12 >= Math.PI) ang12 -= Math.PI * 2;
                            else if (ang12 <= -Math.PI) ang12 += Math.PI * 2;
                            if (ang21 >= Math.PI) ang21 -= Math.PI * 2;
                            else if (ang21 <= -Math.PI) ang21 += Math.PI * 2;
                            if (ang22 >= Math.PI) ang22 -= Math.PI * 2;
                            else if (ang22 <= -Math.PI) ang22 += Math.PI * 2;

                            if (Math.sign(ang11) === Math.sign(ang12) && Math.sign(ang21) === Math.sign(ang22)) {
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

        console.log(nodes);
        return nodes;
    }

    public linkNodes (nn1: PathNode, nn2: PathNode): void {
        const dist = Math.sqrt((nn1.x - nn2.x) * (nn1.x - nn2.x) + (nn1.y - nn2.y) * (nn1.y - nn2.y));
        nn1.addLinkTo(nn2, dist);
        nn2.addLinkTo(nn1, dist);
    }
}

import { Stairs } from '../model/stairs.class';
import { Map } from '../model/map.class';
import { TeleporterNode } from './teleporter-node.class';
import { Floor } from '../model/floor.class';
import { LinePath } from './line-path.class';
import { FloorGraph } from './floor-graph.class';
import { Vector } from './vector.class';
import { Line } from '../model/line.class';
import { Point } from '../model/point.class';
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
        const costs = [];
        const parents = [];
        for (let n = 0; n < nodes.length; n++) {
            costs.push(nodes[n] === from ? 0 : Number.MAX_VALUE);
            parents.push(nodes[n]);
        }
        closedList.push(from);

        return this.calculatePath(nodes, costs, parents, openList, closedList, to);
    }

    // returns null, if this path is not possible
    private calculatePath(nodes: PathNode[], costs: number[], parents: PathNode[],
                          openList: PathNode[], closedList: PathNode[], end: PathNode): PathNode[] {

        let min = Number.MAX_VALUE;
        let curCost = min;
        let foundNewNode = false;
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

                        foundNewNode = true;
                        openList.push(cl.links[j]);
                    }

                    // from all the open links, select the best link with minimal cost
                    if (curCost < min) {
                        min = curCost;
                        minClNode = cl;
                        minLinkIndex = j;
                    }
                } else {
                    // already in closed list
                }
            }
        }

        // cant generate path.
        if (!foundNewNode) {
            return null;
        }

        openList = openList.splice(openList.indexOf(minClNode.links[minLinkIndex]), 1);
        closedList.push(minClNode.links[minLinkIndex]);

        if (openList.length > 0 && closedList.indexOf(end) < 0) {
            return this.calculatePath(nodes, costs, parents, openList, closedList, end);
        } else {

            // got the costs over the nodes. now back-track.
            // start at end node and backtrack over the parent for each node.
            // while the last node in backtracking-path has a valid parent (means: not themselves), go on.
            const resultPath = [];
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

            if (s >= endpointTolerance && s <= 1 - endpointTolerance && t >= endpointTolerance && t <= 1 - endpointTolerance) {
                intersects = true;
                break;
            }
        }

        return intersects;
    }

    private createNodesForWallEnd(p1: Point, p2: Point, radius: number, walls: Line[], smooth: boolean = false): PathNode[] {

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


            // we only need 1 pathnode, if the max angle over it is > 180°
            // if the angle is > 270, it looks more natural to have actually 2 nodes here!
            // but thats a thing of beauty. in the worst case, if we smooth we have twice as much nodes!!!
            if (Math.abs(neighbours[n].a - nextAng) > Math.PI) {

                const res = Math.abs(neighbours[n].a - nextAng) > Math.PI * 1.5 ? (smooth ? 3 : 2) : 2;
                for (let b = 1; b < res; b++) {
                    let midAng = nextAng + ((neighbours[n].a - nextAng) / res) * b;

                    // mirror the angle if the next neighbour has exactly the same angle!
                    if (midAng === neighbours[n].a) {
                        midAng = (midAng + Math.PI) % Math.PI * 2;
                    }

                    const midV = new Vector(Math.cos(midAng) * radius, Math.sin(midAng) * radius);

                    // again, check if this point is near any line.
                    for (const l of walls) {
                        if (this.distToLineSegmentSquared(new Point(p1.x + midV.x, p1.y + midV.y), l.p1, l.p2) < radius ) {
                            nodes.push(new PathNode(p1.x + midV.x, p1.y + midV.y));
                        } else {
                            // otherwise you are too fat to pass through this small gap :P
                        }
                    }
                }
            }
        }

        return nodes;
    }

    private distToLineSegmentSquared(p: Point, e1: Point, e2: Point) {
        const l2 = Math.sqrt(e1.x - e2.x ** 2 + e1.y - e2.y ** 2);
        if (l2 === 0) return Math.sqrt(p.x - p.x ** 2 + p.y - p.y ** 2);
        let t = ((p.x - e1.x) * (e2.x - e1.x) + (p.y - e1.y) * (e2.y - e1.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        const obj = { x: e1.x + t * (e2.x - e1.x), y: e1.y + t * (e2.y - e1.y) };
        return Math.sqrt(p.x - obj.x ** 2 + p.y - obj.y ** 2);
    }


    public linkNodes(nn1: PathNode, nn2: PathNode): void {
        const dist = Math.sqrt((nn1.x - nn2.x) * (nn1.x - nn2.x) + (nn1.y - nn2.y) * (nn1.y - nn2.y));
        nn1.addLinkTo(nn2, dist);
        nn2.addLinkTo(nn1, dist);
    }


    // ############################## Floor Graph #########################################

    // advanced approach: more complex in preparation, but less nodes, so cheaper for path finding.
    public createLinkedFloorGraph(walls: Line[], radius: number, smooth: boolean = false): FloorGraph {


        // total nodes list
        const nodes: PathNode[] = [];
        this.connections = [];      // not needed anymore. DEPRECTAED. only for debug of the last calculatet floorgraph.

        // checked-links list, which contains checked links, but theese links were not worth it
        const chckd: Line[] = [];

        // checked-links list, which contains checked points, which we generated nodes for.
        const chckdP: Point[] = [];

        // first, search for all endpoints and creates node around them.
        for (const w of walls) {

            if (chckdP.find(el => el.equals(w.p1)) === undefined) {
                nodes.push(...this.createNodesForWallEnd(w.p1, w.p2, radius, walls, smooth));
                chckdP.push(w.p1);
            }

            if (chckdP.find(el => el.equals(w.p2)) === undefined) {
                nodes.push(...this.createNodesForWallEnd(w.p2, w.p1, radius, walls, smooth));
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
                                n1.x, n1.y, n2.x, n2.y, walls, -0.00001)
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

        // just return the basic graph. we didnt calculate the path yet.
        return new FloorGraph(nodes, null);
    }

    // inserts start/end/stair points or something to the floor graph.
    public insertPointsToFloorGraph(points: Point[], floorGraph: FloorGraph, walls: Line[]): void {

        // connect every point to visible nodes!
        for (const p of points) {
            if (p !== null && p !== undefined) {
                const pn = new PathNode(p.x, p.y);
                floorGraph.nodes.push(pn);
                for (const n of floorGraph.nodes) {

                    // if this link doesnt intersect any "polygon-borders" (connections)
                    if (!this.checkIntersectionOfLineWithLines(
                            pn.x, pn.y, n.x, n.y, walls, -0.00001)
                    ) {

                        // we need this link!
                        this.linkNodes(pn, n);
                    }
                }
            }
        }
    }

    // finds path from start to end on the given floor
    public generatePath(start: Point, end: Point, floor: Floor, considerInsertingPoints: boolean = true): void {

        // work with a copy of the floorgraph.
        const cpy: FloorGraph = new FloorGraph();
        for (const n of floor.floorGraph.nodes) {
            cpy.nodes.push(n);
        }

        if (considerInsertingPoints) {
            // optionally add start and end, if they are not already included
            const additionalPoints = [];
            if (floor.getAllSelectables().map(ele => ele.center).find(
                    el => el.x === start.x && el.y === start.y
                ) === undefined) {
                additionalPoints.push(start);
            }
            if (floor.getAllSelectables().map(ele => ele.center).find(
                    el => el.x === end.x && el.y === end.y
                ) === undefined) {
                additionalPoints.push(end);
            }
            this.insertPointsToFloorGraph([start, end], cpy, floor.walls);
        }

        // find path in this node system
        const path = this.findPathFromTo(cpy.nodes,
            cpy.nodes.find(el => el.x === start.x && el.y === start.y),
            cpy.nodes.find(el => el.x === end.x && el.y === end.y));

        floor.floorGraph.paths.push(new LinePath());
        if (path !== null) {
            for (let i = 1; i < path.length; i++) {
                floor.floorGraph.paths[floor.floorGraph.paths.length - 1].path.push(new Line(
                    new Point(path[i].x, path[i].y, false),
                    new Point(path[i - 1].x, path[i - 1].y, false)
                ));
            }
        } else {

        }
    }


    // ############################## Stair Graph #########################################
    public generateTeleporterGraphOnMap(map: Map) {

        const totalNodes: TeleporterNode[] = [];
        const chckdN: {p1: Point, p2: Point, lvl1: number, lvl2: number}[] = [];

        // generate stair-linking for each floor individually
        for (const f of map.floors) {

            // clear the paths on the map!
            f.floorGraph.paths = [];

            const nodes: TeleporterNode[] = [];
            for (const s1 of f.stairways) {
                nodes.push(new TeleporterNode(s1, map.floors.indexOf(f)));
            }

            for (const n1 of nodes) {
                for (const n2 of nodes) {

                    if (n1 !== n2) {
                        if (chckdN.find(el =>
                                ((el.p1.x === n1.stairs.center.x && el.p1.y === n1.stairs.center.y)
                                    && (el.p2.x === n2.stairs.center.x && el.p2.y === n2.stairs.center.y))
                                || ((el.p1.x === n2.stairs.center.x && el.p1.y === n2.stairs.center.y)
                                && (el.p2.x === n1.stairs.center.x && el.p2.y === n1.stairs.center.y))
                            ) === undefined) {


                            this.generatePath(n1.stairs.center, n2.stairs.center, f);
                            if (f.floorGraph.paths[f.floorGraph.paths.length - 1].path.length > 0) {
                                const length = f.floorGraph.paths[f.floorGraph.paths.length - 1].getLength();
                                n1.links.push(n2);
                                n1.costs.push(length);
                                n2.links.push(n1);
                                n2.costs.push(length);
                            }

                            chckdN.push({
                                p1: n1.stairs.center, p2: n2.stairs.center,
                                lvl1: map.floors.indexOf(f), lvl2: map.floors.indexOf(f)
                            });
                        }
                    }
                }
            }

            totalNodes.push(...nodes);
        }


        // in the second part, we just link the stairs of individual floors together!
        for (const n1 of totalNodes) {
            for (const n2 of totalNodes) {
                if ((n1 !== n2) && n1.stairs.group !== null && n2.stairs.group !== null && n1.floorLevel !== n2.floorLevel) {

                    if (chckdN.find(el =>
                            ((el.p1.x === n1.stairs.center.x && el.p1.y === n1.stairs.center.y)
                                && (el.p2.x === n2.stairs.center.x && el.p2.y === n2.stairs.center.y)
                                && (el.lvl1 === n1.floorLevel && el.lvl2 === n2.floorLevel))
                            || ((el.p1.x === n2.stairs.center.x && el.p1.y === n2.stairs.center.y)
                            && (el.p2.x === n1.stairs.center.x && el.p2.y === n1.stairs.center.y)
                            && (el.lvl1 === n2.floorLevel && el.lvl2 === n1.floorLevel))
                        ) === undefined) {

                        // we need to check, if one stair has the other as target
                        if (n1.stairs.group === n2.stairs.group) {

                            // pythagoras value for this 3d length :D
                            const hDist = Math.sqrt(
                                (n2.stairs.center.x - n1.stairs.center.x) ** 2 + (n2.stairs.center.y - n1.stairs.center.y) ** 2
                            );
                            const vDist = (n2.floorLevel - n1.floorLevel) * 500;  // just some random value.
                            const length = Math.sqrt(hDist ** 2 + vDist ** 2);

                            n1.links.push(n2);
                            n1.costs.push(length);
                            n2.links.push(n1);
                            n2.costs.push(length);
                        }

                        chckdN.push({
                            p1: n1.stairs.center,
                            p2: n2.stairs.center,
                            lvl1: n1.floorLevel,
                            lvl2: n2.floorLevel
                        });
                    }
                }
            }
        }

        map.stairGraph = totalNodes;
    }

    // finds the path globally through the whole building from start (floor1) to end (floor2)
    public generateGlobalPath(point1: Point, floorId1: number, point2: Point, floorId2: number,
                              currentMap: Map): void {


        // first, clear all paths on the whole map!
        for (const f of currentMap.floors) {
            f.floorGraph.paths = [];
        }


        // pre-check any easy conditions!
        if (floorId1 === floorId2) {
            this.generatePath(point1, point2, currentMap.floors[floorId1]);
            if (currentMap.floors[floorId1].floorGraph.paths[currentMap.floors[floorId1].floorGraph.paths.length - 1].path.length > 0) {
                return;
            }

            if (point1.equals(point2)) {
                return;
            }
        }

        // create a copy of the stair graph. and add start and end.
        const cpy: TeleporterNode[] = [];
        Object.assign(cpy, currentMap.stairGraph);
        const stnt = new TeleporterNode(new Stairs('start point', new Point(point1.x + 10, point1.y + 10, false),
            new Point(point1.x - 10, point1.y - 10, false)), floorId1);
        const ndnt = new TeleporterNode(new Stairs('end point', new Point(point2.x + 10, point2.y + 10, false),
            new Point(point2.x - 10, point2.y - 10, false)), floorId2);

        // connect the start and end with other stairs on the same floor
        for (const st of cpy) {
            if (st.floorLevel === floorId1) {

                // if start and end equal each other, connect them anyways.
                if (st.stairs.center.equals(stnt.stairs.center)) {
                    st.links.push(stnt);
                    st.costs.push(0);
                    stnt.links.push(st);
                    stnt.costs.push(0);
                    continue;
                }

                this.generatePath(point1, st.stairs.center, currentMap.floors[floorId1]);
                if (currentMap.floors[floorId1].floorGraph.paths[currentMap.floors[floorId1].floorGraph.paths.length - 1].path.length > 0) {
                    const length = currentMap.floors[floorId1].floorGraph.paths[
                    currentMap.floors[floorId1].floorGraph.paths.length - 1
                        ].getLength();
                    st.links.push(stnt);
                    st.costs.push(length);
                    stnt.links.push(st);
                    stnt.costs.push(length);
                }
            }

            if (st.floorLevel === floorId2) {

                // if start and end equal each other, connect them anyways.
                if (st.stairs.center.equals(ndnt.stairs.center)) {
                    st.links.push(ndnt);
                    st.costs.push(0);
                    ndnt.links.push(st);
                    ndnt.costs.push(0);
                    continue;
                }

                this.generatePath(point2, st.stairs.center, currentMap.floors[floorId2]);
                if (currentMap.floors[floorId2].floorGraph.paths[currentMap.floors[floorId2].floorGraph.paths.length - 1].path.length > 0) {
                    const length = currentMap.floors[floorId2].floorGraph.paths[
                    currentMap.floors[floorId2].floorGraph.paths.length - 1
                        ].getLength();
                    st.links.push(ndnt);
                    st.costs.push(length);
                    ndnt.links.push(st);
                    ndnt.costs.push(length);
                }
            }
        }
        cpy.push(stnt, ndnt);

        // now search the shortest global path from start to end
        // this is kind of funny ;)
        const stairPath = this.findStairPathFromTo(cpy, stnt, ndnt);

        this.clearAllFloorGraphs(currentMap);

        // now go through the global stairpath and just calculate the paths between the stairs on the same floor.
        // its already ensured, that theese stairs have a connection on the same floor. so just calculate straightforward.
        if (stairPath !== null && stairPath.length > 0) {
            let curFloor = floorId1;
            for (let i = 1; i < stairPath.length; i++) {

                if (stairPath[i].floorLevel === curFloor) {
                    this.generatePath(stairPath[i - 1].stairs.center, stairPath[i].stairs.center, currentMap.floors[curFloor]);
                } else {
                    curFloor = stairPath[i].floorLevel;
                }
            }
        } else {

            console.log('this path is not possible!');

            // Again, clear all paths on the whole map!
            for (const f of currentMap.floors) {
                f.floorGraph.paths = [];
            }
        }
    }

    private clearAllFloorGraphs(map: Map): void {

        // clear all paths on the whole map!
        for (const f of map.floors) {
            f.floorGraph.paths = [];
        }
    }

    public findStairPathFromTo(nodes: TeleporterNode[], from: TeleporterNode, to: TeleporterNode): TeleporterNode[] {

        if (from === to || nodes.indexOf(from) === nodes.indexOf(to)) return [from];

        // open/closed nodes for pathfinding
        const openList = [];
        const closedList = [];


        // assign initial costs for nodes, and create their parents for backtracking the best path.
        const costs = [];
        const parents = [];
        for (let n = 0; n < nodes.length; n++) {
            costs.push(nodes[n] === from ? 0 : Number.MAX_VALUE);
            parents.push(nodes[n]);
        }
        closedList.push(from);

        return this.calculateStairPath(nodes, costs, parents, openList, closedList, to);
    }

    // returns null, if this path is not possible
    private calculateStairPath(nodes: TeleporterNode[], costs: number[], parents: TeleporterNode[],
                               openList: TeleporterNode[], closedList: TeleporterNode[], end: TeleporterNode): TeleporterNode[] {

        let min = Number.MAX_VALUE;
        let curCost = min;
        let foundNewNode = false;
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

                        foundNewNode = true;
                        openList.push(cl.links[j]);
                    }

                    // from all the open links, select the best link with minimal cost
                    if (curCost < min) {
                        min = curCost;
                        minClNode = cl;
                        minLinkIndex = j;
                    }
                } else {
                    // already in closed list
                }
            }
        }

        // cant generate path.
        if (!foundNewNode) {
            return null;
        }

        openList = openList.splice(openList.indexOf(minClNode.links[minLinkIndex]), 1);
        closedList.push(minClNode.links[minLinkIndex]);

        if (openList.length > 0 && closedList.indexOf(end) < 0) {
            return this.calculateStairPath(nodes, costs, parents, openList, closedList, end);
        } else {

            // got the costs over the nodes. now back-track.
            // start at end node and backtrack over the parent for each node.
            // while the last node in backtracking-path has a valid parent (means: not themselves), go on.
            const resultPath = [];
            resultPath.push(end);
            while (parents[nodes.indexOf(resultPath[resultPath.length - 1])] !== resultPath[resultPath.length - 1]) {
                resultPath.push(parents[nodes.indexOf(resultPath[resultPath.length - 1])]);
            }
            resultPath.reverse();
            return resultPath;
        }
    }
}

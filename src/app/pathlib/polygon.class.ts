import { VertexRef } from './vertex-ref.class';
import { Point } from './../model/point.class';
import { Line } from './../model/line.class';

export class Polygon {

    public vertex: VertexRef;

    constructor(vertex: VertexRef) {
        this.vertex = vertex;
    }

    // implementation after jordan.
    // see https://de.wikipedia.org/wiki/Punkt-in-Polygon-Test_nach_Jordan for details.
    // determines, if first-polygon's first vertex is inside another polygon.
    public isBeginningPointInsideOther(first: Polygon, other: Polygon): boolean {

        // create a pointer cop, for looping
        let ref: VertexRef = Object.assign(other.vertex);

        let num = 0; // count of intersections

        // cast line to any random direction
        const line = new Line(first.vertex.point, new Point(first.vertex.point.x + 10, first.vertex.point.y + 10, false));

        // count number of intersections.
        let intersection = null;
        const listOfIntersections: Point[] = [];  // store intersections, so we wont count a corner (where 2 polygon-borders meet) twice
        do {
            intersection = this.linesIntersection(line, new Line(ref.point, ref.next.point), true, false, true);
            if ( intersection !== null &&
                listOfIntersections.find(el => el.x === intersection.x && el.y === intersection.y) === undefined &&
                intersection.x - first.vertex.point.x >= 0 && // theese 2 conditions only work in case of casting the ray in +x, +y
                intersection.y - first.vertex.point.y >= 0) {
                num++;
                listOfIntersections.push(intersection);
            }
            ref = ref.next;
        } while (ref !== other.vertex);

        // in case of an odd number of intersections in one direction,
        // this point is inside the other polygon.
        return num % 2 === 1;
    }

    // creates a union with another polygon.
    // this is an implementation after the greiner horman algorithm.
    // see http://www.inf.usi.ch/hormann/papers/Greiner.1998.ECO.pdf for details.
    public union(other: Polygon): Polygon[] {

        // calculate with copies.
        const cpy1: Polygon = Object.assign(this);
        const cpy2: Polygon = Object.assign(other);
        let intersectedAtLeastOnce = false;

        // first, find ALL intersection points globally and add them to both polygons as vertices.
        let intersection: Point = null;
        let l1 = null;
        let l2 = null;
        let v1 = cpy1.vertex;
        let v2 = cpy2.vertex;

        // at starting point, we are outside the second polygon?
        let is_entry = !this.isBeginningPointInsideOther(cpy1, cpy2);
        let intersectionPoints: {p: Point, dist: number, ref: VertexRef}[] = [];        // intersections per line on v1

        // ALL intersections, to prevent multiple intersections on the same point
        const totalIntersectionPoints: {p: Point, p1Vertex: boolean, p1NextVertex: boolean, p2Vertex: boolean}[] = [];


        let weak = false; // weak mode is the case, if v1 is directly on a intersection point, which is a vertex of p1


        do {
            l1 = new Line(v1.point, v1.next.point);
            intersectionPoints = [];

            v2 = cpy2.vertex;

            do {
                l2 = new Line(v2.point, v2.next.point);

                intersection = this.linesIntersection(l1, l2, true);


                // avoid creating new intersection points on the same spot.
                if (intersection !== null && (totalIntersectionPoints !== null ? (
                        totalIntersectionPoints.every(el => !el.p.equals(intersection))
                    ) : true)) {
                    intersectedAtLeastOnce = true;
                    intersectionPoints.push({p: intersection, dist:
                        Math.sqrt((intersection.x - v1.point.x) * (intersection.x - v1.point.x)
                          + (intersection.y - v1.point.y) * (intersection.y - v1.point.y)), ref: v2});
                } else if (intersection === null) {
                    // lines have the same direction.

                }

                v2 = v2.next;
            } while (v2 !== cpy2.vertex);

            // get nearest intersection point
            let nearest = {p: null, dist: Number.MAX_VALUE, ref: null};
            for (const ip of intersectionPoints) {
                if (ip.dist < nearest.dist) {
                    nearest = ip;
                }
            }

            weak = false;

            if (nearest.p !== null) {

                // search for this point in the second polygon.
                // to be able to split both there.
                // but be AWARE! specifically for endpoints we either have the split only on v1 or only on v2

                totalIntersectionPoints.push({p: nearest.p, p1Vertex: false, p1NextVertex: false, p2Vertex: false});

                let ref1 = v1.next;
                if (v1.point.equals(nearest.p)) {
                    totalIntersectionPoints[totalIntersectionPoints.length - 1].p1Vertex = true;
                    ref1 = v1;
                    weak = true;
                }
                if (v1.next.point.equals(nearest.p)) {
                    totalIntersectionPoints[totalIntersectionPoints.length - 1].p1NextVertex = true;
                    ref1 = v1.next;
                }

                v2 = nearest.ref;
                const rref2 = v2.point;
                do {
                    if (nearest.p.equals(v2.point)) {
                        totalIntersectionPoints[totalIntersectionPoints.length - 1].p2Vertex = true;
                    }
                    v2 = v2.next;
                } while (!v2.point.equals(rref2) && !totalIntersectionPoints[totalIntersectionPoints.length - 1].p2Vertex);

                if (! (totalIntersectionPoints[totalIntersectionPoints.length - 1].p1Vertex ||
                       totalIntersectionPoints[totalIntersectionPoints.length - 1].p1NextVertex) ) {
                    ref1 = new VertexRef(nearest.p, v1.next, v1);
                    v1.next.previous = ref1;
                    v1.next = ref1;
                }
                let ref2 = v2.previous;
                if (!totalIntersectionPoints[totalIntersectionPoints.length - 1].p2Vertex) {
                    ref2 = new VertexRef(nearest.p, nearest.ref.next, nearest.ref);
                    nearest.ref.next.previous = ref2;
                    nearest.ref.next = ref2;
                }

                if (totalIntersectionPoints[totalIntersectionPoints.length - 1].p1Vertex) {
                    if (totalIntersectionPoints[totalIntersectionPoints.length - 1].p2Vertex) {
                        is_entry = null;
                    } else {
                        is_entry = true;
                    }
                } else {
                    if (totalIntersectionPoints[totalIntersectionPoints.length - 1].p2Vertex) {
                        is_entry = false;
                    } else {
                        // nothing

                    }
                }

                ref1.data = (totalIntersectionPoints[totalIntersectionPoints.length - 1].p2Vertex ?
                              v2.previous : v2.next); // save neighbour data
                ref2.data = ref1;
                ref1.entry_exit = is_entry; // enter second polygon
                ref2.entry_exit = is_entry;
                is_entry = !is_entry;
            }

            if (!weak) {
                v1 = v1.next;
            }
        } while (v1 !== cpy1.vertex || weak);


        if (!intersectedAtLeastOnce) {
            return [cpy1, cpy2];
        }


        // perform polygon clipping. Note, that also othershapes are possible now.
        // now we have both polygons with all the intersection points on them.
        // begin on one point.
        // this method here only works with polygons, that are constructed in the same (anti-)clockwise direction
        const first = new VertexRef(v1.point);
        const resultPolygon = new Polygon(first);
        v1 = v1.next;

        let debugCounter = 0;

        // we can determine the outside/inside polygon question with the number of vertices touched?
        // HAS TO BE FALSE!
        // !totalIntersectionPoints[0].p2Vertex && totalIntersectionPoints[0].p1Vertex
        is_entry = (false) ? is_entry : !is_entry;

        do {
            const ref = new VertexRef(v1.point);
            ref.previous = resultPolygon.vertex;
            ref.previous.next = ref;
            resultPolygon.vertex = ref;
            if (v1.entry_exit !== null && v1.data !== null && v1.entry_exit !== is_entry) {
                v1 = v1.data;
                is_entry = !is_entry;
            }
            debugCounter++;

            v1 = v1.next;
        } while (!v1.point.equals(first.point) && debugCounter < 20);

        // connect one last time
        resultPolygon.vertex.next = first;
        first.previous = resultPolygon.vertex;
        resultPolygon.vertex = resultPolygon.vertex.next;

        return [resultPolygon];
    }

    // returns the point of intersection, otherwise null if they are parallel
    public linesIntersection(l1: Line, l2: Line, includeEndpoints = true, onFirstSegment = true, onSecondSegment = true) {
        // find the parameter values (s, t) for the intersection point of theese 2 lines
        const s = ( -(l1.p2.y - l1.p1.y) * (l1.p1.x - l2.p1.x)
                    + (l1.p2.x - l1.p1.x) * (l1.p1.y - l2.p1.y))
                  / (-(l2.p2.x - l2.p1.x) * (l1.p2.y - l1.p1.y) + (l1.p2.x - l1.p1.x) * (l2.p2.y - l2.p1.y));
        const t = ( (l2.p2.x - l2.p1.x) * (l1.p1.y - l2.p1.y)
                    - (l2.p2.y - l2.p1.y) * (l1.p1.x - l2.p1.x))
                  / (-(l2.p2.x - l2.p1.x) * (l1.p2.y - l1.p1.y) + (l1.p2.x - l1.p1.x) * (l2.p2.y - l2.p1.y));

        if (includeEndpoints ?
              ( (onSecondSegment ? (s >= 0 && s <= 1) : true) && (onFirstSegment ? (t >= 0 && t <= 1) : true))
              : ( (onSecondSegment ? (s > 0 && s < 1) : true) && (onFirstSegment ? (t > 0 && t < 1) : true) )) {
            return new Point(l1.p1.x + (l1.p2.x - l1.p1.x) * t, l2.p1.y + (l2.p2.y - l2.p1.y) * s, false);
        }

        return null;
    }

    public isPointOnLine(p: Point, l: Line, onSegment: boolean = false): boolean {

        // return cross product = 0. And if this is the case, check if point is on segment (if needed)

        return ((p.x - l.p1.x) * (l.p2.y - l.p1.y) - (p.y - l.p1.y) * (l.p2.x - l.p1.x) === 0)
                  && (onSegment ? (
                            Math.sqrt((l.p2.x - l.p1.x) * (l.p2.x - l.p1.x) + (l.p2.y - l.p1.y) * (l.p2.y - l.p1.y))
                            >= Math.sqrt((p.x - l.p1.x) * (p.x - l.p1.x) + (p.y - l.p1.y) * (p.y - l.p1.y))
                      ) : true);
    }
}

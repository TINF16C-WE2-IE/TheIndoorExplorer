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
        const totalIntersectionPoints: Point[] = [];   // ALL intersections, to prevent multiple intersections on the same point

        let debugCounter = 0;

        do {
            l1 = new Line(v1.point, v1.next.point);
            intersectionPoints = [];

            console.log('checking itersection on', l1);
            v2 = cpy2.vertex;

            do {
                l2 = new Line(v2.point, v2.next.point);

                intersection = this.linesIntersection(l1, l2, true);

                console.log('  --> checking itersection on', l2);

                // avoid creating new intersection points on the same spot.
                if (intersection !== null && (totalIntersectionPoints !== null ? (
                        totalIntersectionPoints.every(el => !el.equals(intersection))
                    ) : true)) {
                    intersectedAtLeastOnce = true;
                    intersectionPoints.push({p: intersection, dist:
                        Math.sqrt((intersection.x - v1.point.x) * (intersection.x - v1.point.x)
                          + (intersection.y - v1.point.y) * (intersection.y - v1.point.y)), ref: v2});
                } else {
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

            let weak = false;

            if (nearest.p !== null) {

                // search for this point in the second polygon.
                // to be able to split both there.
                // but be AWARE! specifically for endpoints we either have the split only on v1 or only on v2

                let p1SegmentPoint = false;
                let p2SegmentPoint = false;

                console.log('our intersection is', nearest.p);
                totalIntersectionPoints.push(nearest.p);

                let ref1 = v1.next;
                if (v1.point.equals(nearest.p)) {
                    console.log('v1 has the intersection point as vertex ref.');
                    p1SegmentPoint = true;
                    debugCounter++;
                    ref1 = v1;
                    weak = true;
                }
                if (v1.next.point.equals(nearest.p)) {
                    console.log('v1 has the intersection point as the next vertex ref.');
                    p1SegmentPoint = true;
                    ref1 = v1.next;
                }

                v2 = nearest.ref;
                const rref2 = v2.point;
                do {
                    console.log('checking on v2: ', v2.point);
                    if (nearest.p.equals(v2.point)) {
                        console.log('v2 has the intersection point as a vertex ref.');
                        p2SegmentPoint = true;
                    }
                    v2 = v2.next;
                } while (!v2.point.equals(rref2) && !p2SegmentPoint);

                console.log('*** after checking ***', p1SegmentPoint, p2SegmentPoint, v1.point, v2.point, rref2, nearest.ref);

                if (!p1SegmentPoint) {
                    console.log('split v1!');
                    ref1 = new VertexRef(nearest.p, v1.next, v1);
                    v1.next.previous = ref1;
                    v1.next = ref1;
                }
                let ref2 = v2;
                if (!p2SegmentPoint) {
                    console.log('split v2!');
                    ref2 = new VertexRef(nearest.p, nearest.ref.next, nearest.ref);
                    nearest.ref.next.previous = ref2;
                    nearest.ref.next = ref2;
                }

                // his is a special case. we have to be careful which points to connect.
                if (p1SegmentPoint && p2SegmentPoint) {
                    // TODO
                }

                console.log('connect both!');
                ref1.data = (p2SegmentPoint) ? v2.previous : ref2; // save neighbour data
                ref2.data = ref1;
                ref1.entry_exit = is_entry; // enter second polygon
                ref2.entry_exit = is_entry;
                is_entry = !is_entry;         // this was before the 2 lines above!!!! EDIT!!!
            }

            if (!weak) {
                v1 = v1.next;
            }
        } while (v1 !== cpy1.vertex);

        console.log('outside of routine');


        if (!intersectedAtLeastOnce) {
            return [cpy1, cpy2];
        }

        console.log(cpy1, cpy2);

        // perform polygon clipping. Note, that also othershapes are possible now.
        // now we have both polygons with all the intersection points on them.
        // begin on one point.
        // this method here only works with polygons, that are constructed in the same (anti-)clockwise direction
        const first = new VertexRef(v1.point);
        const resultPolygon = new Polygon(first);
        v1 = v1.next;

        console.log(first, v1);

        do {
            const ref = new VertexRef(v1.point);
            ref.previous = resultPolygon.vertex;
            ref.previous.next = ref;
            resultPolygon.vertex = ref;
            if (v1.entry_exit !== null && v1.data !== null) {
                console.log('switch sides.', is_entry);
                v1 = v1.data;
                is_entry = !is_entry;
            }
            console.log('polygon on point: ', resultPolygon.vertex.point, 'next would be', v1.next);

            debugCounter++;
            v1 = v1.next;
        } while (v1 !== this.vertex && debugCounter < 10);

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

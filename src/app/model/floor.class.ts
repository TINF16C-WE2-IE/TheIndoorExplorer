import { Portal } from './portal.class';
import { Wall } from './wall.class';
import { Point } from './point.class';

export class Floor {

    public portals: Portal[] = [];
    public walls: Wall[] = [];

    constructor(obj: {
        walls: {p1: {x: number, y: number}, p2: {x: number, y: number}}[],
        portals: {id: number, label: string, p1: {x: number, y: number}, p2: {x: number, y: number}}[]
    }) {
        for (const wall_obj of obj.walls) {
            const p1 = this.getExistingPoint(new Point(wall_obj.p1.x, wall_obj.p1.y));
            const p2 = this.getExistingPoint(new Point(wall_obj.p2.x, wall_obj.p2.y));
            this.walls.push(new Wall(p1, p2));
        }
        for (const portal_obj of obj.portals) {
            const p1 = this.getExistingPoint(new Point(portal_obj.p1.x, portal_obj.p1.y));
            const p2 = this.getExistingPoint(new Point(portal_obj.p2.x, portal_obj.p2.y));
            this.portals.push(new Portal(portal_obj.id, portal_obj.label, p1, p2));
        }
    }

    public getAllPoints(): Point[] {
        return Array.from(new Set(
            [...this.walls, ...this.portals]
                .map(line => {
                    return line.getPoints();
                })
                .reduce((prev, current) => prev.concat(current), [])
        ));
    }

    public getExistingPoint(p: Point) {
        const points: Point[] = this.getAllPoints().filter(point => point.equals(p));
        if (points.length > 1) {
            console.log('WARNING! Twin points found!', JSON.stringify(points));
        }
        return points.length > 0 ? points[0] : p;
    }

    public joinPoints(master: Point, slave: Point) {
        [...this.walls, ...this.portals].filter(line => {
            try {
                // replace slave Point instance with master instance, if possible
                line.replacePoint(slave, master);
                return true;
            } catch (LineEndpointsEqualError) {
                // delete line if its endpoints collide
                return false;
            }
        });
    }
}

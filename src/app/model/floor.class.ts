import { Portal } from './portal.class';
import { Wall } from './wall.class';
import { Point } from './point.class';
import { Line } from './line.class';

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

    public getExistingPoint(p: Point, exclude: Point[] = []) {
        const points: Point[] = this.getAllPoints().filter(
            point => point.equals(p) && exclude.indexOf(point) === -1
        );
        if (points.length > 1) {
            console.log('WARNING! Twin points found!', JSON.stringify(points));
        }
        return points.length > 0 ? points[0] : p;
    }

    public joinPoints(master: Point, slave: Point) {
        const lines = [...this.walls, ...this.portals] as Line[];
        for (const line of lines) {
            line.replacePoint(slave, master);
            if (line.isValid()) {
                if (
                    this.walls.find(w => !w.deleted && line !== w && line.equals(w)) ||
                    this.portals.find(p => !p.deleted && line !== p && line.equals(p))
                ) {
                    console.log('Deleting invalid line (duplicate):', JSON.stringify(line));
                    line.deleted = true;
                }
            }
            else {
                console.log('Deleting invalid line (start=end):', JSON.stringify(line));
                line.deleted = true;
            }
        }
        this.walls = this.walls.filter(wall => !wall.deleted);
        this.portals = this.portals.filter(portal => !portal.deleted);

        //
        // if (1 == 1) return;
        // this.walls = this.walls.filter(wall => {
        //     // replace slave Point instance with master instance, if possible
        //     wall.replacePoint(slave, master);
        //     if (wall.isValid()) {
        //         if (
        //             this.walls.find(w => wall !== w && wall.equals(w)) ||
        //             this.portals.find(p => wall.equals(p))
        //         ) {
        //             console.log('Deleting invalid wall (duplicate):', JSON.stringify(wall));
        //             wall.p1 = null;  // to avoid deleting the other equal wall later
        //             return false;
        //         }
        //         else return true;
        //     }
        //     else {
        //         console.log('Deleting invalid wall (start=end):', JSON.stringify(wall));
        //         return false;
        //     }
        // });
        //
        // this.portals = this.portals.filter(portal => {
        //     // replace slave Point instance with master instance, if possible
        //     portal.replacePoint(slave, master);
        //     if (portal.isValid()) {
        //         if (this.walls.find(p => portal !== p && portal.equals(p))) {
        //             console.log('Deleting invalid portal (duplicate):', JSON.stringify(portal));
        //             portal.p1 = null;  // to avoid deleting the other equal portal later
        //             return false;
        //         }
        //         else return true;
        //     }
        //     else {
        //         console.log('Deleting invalid portal (start=end):', JSON.stringify(portal));
        //         return false;
        //     }
        // });
    }
}

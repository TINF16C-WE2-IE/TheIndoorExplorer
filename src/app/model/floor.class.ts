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
            const p1 = this.getExistingOrThisPoint(new Point(wall_obj.p1.x, wall_obj.p1.y));
            const p2 = this.getExistingOrThisPoint(new Point(wall_obj.p2.x, wall_obj.p2.y));
            this.walls.push(new Wall(p1, p2));
        }
        for (const portal_obj of obj.portals) {
            const p1 = this.getExistingOrThisPoint(new Point(portal_obj.p1.x, portal_obj.p1.y));
            const p2 = this.getExistingOrThisPoint(new Point(portal_obj.p2.x, portal_obj.p2.y));
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

    public getExistingOrThisPoint(p: Point, exclude: Point[] = [], nullIfNotFound = false) {
        const points: Point[] = this.getAllPoints().filter(
            point => point !== p && point.equals(p) && exclude.indexOf(point) === -1
        );
        if (points.length > 1) {
            console.log('WARNING! Twin points found!', JSON.stringify(points));
        }

        if (points.length > 0) {
            return points[0];
        }
        else {
            return nullIfNotFound ? null : p;
        }
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
    }

    public forExport() {
        return {
            walls: this.walls.map(wall => wall.forExport()),
            portals: this.portals.map(portal => portal.forExport())
        };
    }
}

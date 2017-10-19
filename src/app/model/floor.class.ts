import { Portal } from './portal.class';
import { Wall } from './wall.class';
import { Point } from './point.class';

export class Floor {
    public portals: Portal[];
    public walls: Wall[];

    constructor(walls: Wall[], doors: Portal[]) {
        this.walls = walls;
        this.portals = doors;
    }

    public getWalls() {
        console.log(this.walls);
        return this.walls;
    }

    public getAllPoints(): Point[] {
        return [...this.walls, ...this.portals]
            .map(line => line.getPoints())
            .reduce((prev, current) => prev.concat(current));
    }

    public getExistingPoint(p: Point) {
        const points: Point[] = this.getAllPoints().filter(point => point.equals(p));
        if (points.length > 1) {
            console.log('ERR! Twin points found!', points);
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

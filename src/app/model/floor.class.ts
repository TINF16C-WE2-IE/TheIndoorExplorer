import { Portal } from './portal.class';
import { Wall } from './wall.class';
import { Point } from './point.class';

export class Floor {
    public portals: Portal[];
    public walls: Wall[];

    constructor(walls: Wall[], portals: Portal[]) {
        this.walls = walls;
        this.portals = portals;
    }

    // public getAllPoints(): Set<Point> {
    //     return new Set<Point>(
    //         this.walls.map(wall => wall.getPoints())
    //             .reduce((prev, current) => prev.concat(current))
    //             .concat(
    //                 this.walls.map(wall => wall.getPoints())
    //                     .reduce((prev, current) => prev.concat(current)))
    //     );
    // }

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

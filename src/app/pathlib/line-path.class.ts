import { Line } from './../model/line.class';
export class LinePath {

    public path: Line[];
    public description: string; // a user info for this path (if needed)

    constructor(path: Line[] = [], description = '') {
        this.path = path;
        this.description = description;
    }

    public getLength() {
        let sum = 0;
        for (const l of this.path) {
            sum += Math.sqrt((l.p2.x - l.p1.x) ** 2 + (l.p2.y - l.p1.y) ** 2);
        }
        return sum;
    }
}

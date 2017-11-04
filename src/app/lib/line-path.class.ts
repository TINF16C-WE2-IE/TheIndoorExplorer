import { Line } from './../model/line.class';
export class LinePath {

    public path: Line[];

    constructor(path: Line[] = []) {
        this.path = path;
    }

    public getLength() {
        let sum = 0;
        for (const l of this.path) {
            sum += Math.sqrt((l.p2.x - l.p1.x) * (l.p2.x - l.p1.x) + (l.p2.y - l.p1.y) * (l.p2.y - l.p1.y));
        }
        return sum;
    }
}

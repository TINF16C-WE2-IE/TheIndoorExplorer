import { Line } from './../model/line.class';
export class LinePath {

    public path: Line[];

    constructor(path: Line[] = []) {
        this.path = path;
    }
}

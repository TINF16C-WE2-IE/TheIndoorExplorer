import { LinePath } from './line-path.class';
import { PathNode } from './path-node.class';
export class FloorGraph {

    public nodes: PathNode[];
    public paths: LinePath[];

    constructor(nodes: PathNode[] = [], paths: LinePath[] = []) {
        this.nodes = nodes;
        this.paths = paths;
    }
}

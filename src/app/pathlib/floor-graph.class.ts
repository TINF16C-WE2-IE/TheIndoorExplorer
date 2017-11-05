import { LinePath } from './line-path.class';
import { PathNode } from './path-node.class';
export class FloorGraph {

    public nodes: PathNode[];
    public path: LinePath;

    constructor(nodes: PathNode[] = [], path: LinePath = null) {
        this.nodes = nodes;
        this.path = path;
    }
}

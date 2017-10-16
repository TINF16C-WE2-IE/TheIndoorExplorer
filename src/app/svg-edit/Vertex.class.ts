import { Map } from './../model/map.class';

export class Vertex {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    gridSnap(arr, threshold?: number): Vertex {
        if (!threshold) threshold = 10;
        this.x = Math.round(arr[0] / threshold) * threshold;
        this.y = Math.round(arr[1] / threshold) * threshold;
        return this;
    }

    mouseGridSnap(evt, canvasOffset): Vertex {
        return this.gridSnap([evt.layerX - canvasOffset.x, evt.layerY - canvasOffset.y]);
    }

    equals(v: Vertex): boolean {
        return this.x === v.x && this.y === v.y;
    }

    clone(): Vertex {
        return new Vertex(this.x, this.y);
    }

    fromArray(arr) {
        this.x = arr[0];
        this.y = arr[1];
    }

    toArray() {
        return [this.x, this.y];
    }

    private getExistingInList(list): Vertex {
        list.forEach(wall => {
            if (this.equals(wall.a) && this !== wall.a) return wall.a;
            if (this.equals(wall.b) && this !== wall.b) return wall.b;
        });
        return null;
    }

    getExisting(struct): Vertex {
        let found = this.getExistingInList(struct.walls);
        if (found) return found;
        found = this.getExistingInList(struct.doors);
        if (found) return found;
        return null;
    }

    getExistingOrClone(struct): Vertex {
        const found = this.getExisting(struct);
        if (found) return found;
        return this.clone();
    }
    getExistingOrMe(struct): Vertex {
        const found = this.getExisting(struct);
        if (found) return found;
        return this;
    }
}


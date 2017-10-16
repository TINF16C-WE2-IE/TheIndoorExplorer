export class Point {
    public x: number;
    public y: number;

    constructor(x: number, y: number, snapToGrid = true) {
        this.x = x;
        this.y = y;
        if (snapToGrid) this.gridSnap();
    }

    gridSnap(threshold = 10): void {
        this.x = Math.round(this.x / threshold) * threshold;
        this.y = Math.round(this.y / threshold) * threshold;
    }

    equals(other: Point) {
        return this.x === other.x && this.y === other.y;
    }
}

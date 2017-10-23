export class Point {

    private _gridSnap: boolean;
    private _x: number;
    private _y: number;

    get gridSnap(): boolean {
        return this._gridSnap;
    }

    set gridSnap(value: boolean) {
        this._gridSnap = value;
        if (this.gridSnap) this.snapToGrid();
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
        if (this.gridSnap) this.snapToGrid();
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
        if (this.gridSnap) this.snapToGrid();
    }


    constructor(x: number, y: number, gridSnap = true) {
        this._gridSnap = gridSnap;
        this.setCoords(x, y);
    }


    static snapCoords(x: number, y: number, threshold = 10): {x: number, y: number} {
        return {
            x: Math.round(x / threshold) * threshold,
            y: Math.round(y / threshold) * threshold
        };
    }


    setCoords(x: number, y: number) {
        this._x = x;
        this._y = y;
        if (this.gridSnap) this.snapToGrid();
    }

    snapToGrid(threshold = 10): void {
        const snapped = Point.snapCoords(this._x, this._y, threshold);
        this._x = snapped.x;
        this._y = snapped.y;
    }

    equals(other: Point) {
        return this.x === other.x && this.y === other.y;
    }

    clone(): Point {
        return new Point(this.x, this.y, this.gridSnap);
    }
}

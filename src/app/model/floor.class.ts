import { FloorGraph } from '../pathlib/floor-graph.class';
import { Portal } from './portal.class';
import { Wall } from './wall.class';
import { Point } from './point.class';
import { Line } from './line.class';
import { Selectable } from './selectable.interface';
import { Stairs } from './stairs.class';
import { Elevator } from './elevator.class';
import { Teleporter } from './teleporter.interface';

export class Floor {

    public portals: Portal[] = [];
    public walls: Wall[] = [];
    public stairways: Stairs[] = [];
    public elevators: Elevator[] = [];
    public searchResults: Selectable[] = [];
    public floorGraph: FloorGraph = new FloorGraph();
    public label = '';

    constructor(obj: {
        walls?: {p1: {x: number, y: number}, p2: {x: number, y: number}}[],
        portals?: {label: string, p1: {x: number, y: number}, p2: {x: number, y: number}}[],
        stairways?: {
            label: string, p1: {x: number, y: number}, p2: {x: number, y: number},
            group: number, canEnter: boolean, canLeave: boolean, length: number
        }[],
        elevators?: {label: string, p: {x: number, y: number}, group: number}[],
        label: string
    }) {
        for (const wall_obj of obj.walls || []) {
            const p1 = this.getExistingOrThisPoint(new Point(wall_obj.p1.x, wall_obj.p1.y));
            const p2 = this.getExistingOrThisPoint(new Point(wall_obj.p2.x, wall_obj.p2.y));
            this.walls.push(new Wall(p1, p2));
        }
        for (const portal_obj of obj.portals || []) {
            const p1 = this.getExistingOrThisPoint(new Point(portal_obj.p1.x, portal_obj.p1.y));
            const p2 = this.getExistingOrThisPoint(new Point(portal_obj.p2.x, portal_obj.p2.y));
            this.portals.push(new Portal(portal_obj.label, p1, p2));
        }
        for (const stairs_obj of obj.stairways || []) {
            const p1 = this.getExistingOrThisPoint(new Point(stairs_obj.p1.x, stairs_obj.p1.y));
            const p2 = this.getExistingOrThisPoint(new Point(stairs_obj.p2.x, stairs_obj.p2.y));
            this.stairways.push(new Stairs(stairs_obj.label, p1, p2,
                stairs_obj.group, stairs_obj.canEnter, stairs_obj.canLeave, stairs_obj.length));
        }
        for (const elevator_obj of obj.elevators || []) {
            const p = this.getExistingOrThisPoint(new Point(elevator_obj.p.x, elevator_obj.p.y));
            this.elevators.push(new Elevator(elevator_obj.label, p, elevator_obj.group));
        }
        this.label = obj.label || '';
        this.floorGraph = new FloorGraph();
    }

    public getAllPoints(): Point[] {
        return Array.from(new Set(
            [...this.walls, ...this.portals, ...this.stairways]
                .map(line => line.getPoints())
                .reduce((prev, current) => prev.concat(current), [])
        ));
    }

    public getAllSelectables(): Selectable[] {
        return (this.portals as Selectable[])
            .concat(this.stairways as Selectable[])
            .concat(this.elevators as Selectable[]);
    }

    public getAllTeleporters(): Teleporter[] {
        return (this.stairways as Teleporter[]).concat(this.elevators as Teleporter[]);
    }

    public getExistingOrThisPoint(p: Point, exclude: Point[] = [], nullIfNotFound = false, fromPointList: Point[] = null) {
        const points: Point[] = (fromPointList || this.getAllPoints()).filter(
            point => point !== p && point.equals(p) && exclude.indexOf(point) === -1
        );
        if (points.length > 1) {
            console.log('WARNING! Twin points found!', JSON.stringify(points));
        }

        if (points.length > 0) {
            return points[0];
        }
        else {
            return nullIfNotFound ? null : p;
        }
    }

    public joinPoints(master: Point, slave: Point) {
        this.walls.forEach(line => line.replacePoint(slave, master));
        this.portals.forEach(line => line.replacePoint(slave, master));
        this.stairways.forEach(line => line.replacePoint(slave, master));

        this.walls = this.walls.filter(line => this.lineIsValid(line));
        this.portals = this.portals.filter(line => this.lineIsValid(line));
        this.stairways = this.stairways.filter(line => this.lineIsValid(line));
    }

    private lineIsValid(line: Line) {
        if (line.isValid()) {
            if (
                this.walls.find((w, i) => line !== w && line.equals(w) &&
                    (line instanceof Wall ? this.walls.indexOf(line as Wall) < i : true)) ||
                this.portals.find((p, i) => line !== p && line.equals(p) &&
                    (line instanceof Portal ? this.portals.indexOf(line as Portal) < i : true)) ||
                this.stairways.find((s, i) => line !== s && line.equals(s) &&
                    (line instanceof Stairs ? this.stairways.indexOf(line as Stairs) < i : true))
            ) {
                console.log('Deleting invalid line (duplicate):', JSON.stringify(line.forExport()));
                return false;
            }
            else {
                return true;
            }
        }
        else {
            console.log('Deleting invalid line (start=end):', JSON.stringify(line.forExport()));
            return false;
        }
    }

    public forExport() {
        return {
            walls: this.walls.map(wall => wall.forExport()),
            portals: this.portals.map(portal => portal.forExport()),
            stairways: this.stairways.map(stairs => stairs.forExport()),
            elevators: this.elevators.map(elevator => elevator.forExport()),
            label: this.label
        };
    }

    public search(query: string) {
        if (query.length) {
            this.searchResults = this.getAllSelectables()
                                     .filter(obj => obj.label.toLowerCase().indexOf(query) !== -1);
        }
        else {
            this.searchResults = [];
        }
    }
}

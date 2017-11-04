import { StairNode } from './../../lib/stair-node.class';
import { Floor } from './../../model/floor.class';
import { LinePath } from './../../lib/line-path.class';
import { ModelService } from './../../svc/model.service';
import { Mouse } from './../mouse.class';
import { Pathfinder2 } from './../../lib/pathfinder2.class.';
import { Tool } from './tool.class';
import { Point } from '../../model/point.class';
import { Selectable } from '../../model/selectable.interface';
import { Line } from '../../model/line.class';
import { Pathfinder } from '../../lib/pathfinder.class';

export class DirectionsTool extends Tool {

    public pfinder: Pathfinder2;
    private dragOrigin: {x: number, y: number};
    private panDragOrigin: {x: number, y: number};

    constructor(mouse: Mouse, modelSvc: ModelService, public args = {}) {
        super(mouse, modelSvc, args);

        if (!this.pfinder) this.pfinder = new Pathfinder2();
    }

    public get name() {
        return 'Directions';
    }

    public get cursorShape() {
        return 'pointer';
    }

    public onMouseDown(evt: MouseEvent) {
        this.dragOrigin = {x: evt.x, y: evt.y};
        this.panDragOrigin = {x: this.modelSvc.panOffset.x, y: this.modelSvc.panOffset.y};
    }

    public onMouseUp(evt: MouseEvent) {
        // select object (or points defining lines) below cursor
        const selected = this.getExistingObjectsBelowCursor().obj;
        this.selectWaypoint(selected);
        this.dragOrigin = null;
        this.panDragOrigin = null;
    }

    public onMouseMove(evt: MouseEvent) {
        if (this.panDragOrigin) {
            const ratio = this.modelSvc.canvasSize.x / this.modelSvc.viewportSize.x;
            this.modelSvc.panOffset.x = this.panDragOrigin.x - (evt.x - this.dragOrigin.x) * ratio;
            this.modelSvc.panOffset.y = this.panDragOrigin.y - (evt.y - this.dragOrigin.y) * ratio;
        }
    }

    public selectWaypoint(selected: Selectable | any) {
        // TS has no way of checking for an interface :(
        if (this.isSelectable(selected)) {
            if (this.modelSvc.selectedObjects.length) {
                this.generatePath(this.modelSvc.selectedObjects[0].center, selected.center, this.modelSvc.currentFloor);
                this.modelSvc.selectedObjects = [];
            } else {
                this.modelSvc.selectedObjects.push(selected);
            }
        } else {
            this.modelSvc.selectedObjects = [];
        }
    }

    public onMapLoaded() {
        console.log('would generate nodes on', this.modelSvc.currentMap);

        // create the basic nodegraph on each floor, and insert the static elevators and stairs
        for (const f of this.modelSvc.currentMap.floors) {
            f.floorGraph = this.pfinder.createLinkedFloorGraph([...f.walls], 45, 1);
            this.pfinder.insertPointsToFloorGraph(f.stairways.map(el => el.center), f.floorGraph, f.walls);
        }

        this.generateStairGraphOnCurrentMap();
    }


    public generateStairGraphOnCurrentMap() {

        const totalNodes: StairNode[] = [];
        const chckd = [];

        for (const f of this.modelSvc.currentMap.floors) {

            const nodes: StairNode[] = [];
            for (const s1 of f.stairways) {
                nodes.push(new StairNode(s1));
            }


            for (const n1 of nodes) {
                for (const n2 of nodes) {
                    this.generatePath(n1.stairs.center, n2.stairs.center, f);
                    if (f.floorGraph.path.path.length > 0) {
                        const length = f.floorGraph.path.getLength();
                        n1.links.push(n2);
                        n1.costs.push(length);
                        n2.links.push(n1);
                        n2.costs.push(length);
                    }
                }
            }

            totalNodes.push(...nodes);
        }


        // in the second part, we just link the stairs of individual floors together!
        // TODO
    }

    // finds the path globally through the whole building from start (floor1) to end (floor2)
    public generateGlobalPath(point1: Point, floorId1: number, point2: Point, floorId2: number): void {
        // TODO:
        console.log('global path is todo!');

        // pre-check any easy conditions.
        if (floorId1 === floorId2) {
            this.generatePath(point1, point2, this.modelSvc.currentMap.floors[floorId1]);
        }

        // if we found the path already, all good.
        if (this.floor.floorGraph.path.path.length > 0) {
              return;
        } else {

            // now its getting more complex
            // use the stairgraph of the map!
            // TODO
        }
    }

    // finds path from start to end on the given floor
    public generatePath(start: Point, end: Point, floor: Floor): void {

        // work with a copy of the floorgraph.
        const cpy = Object.assign(floor.floorGraph);

        // optionally add start and end, if they are not already included
        const additionalPoints = [];
        const tolerance = 40;
        if (  [...floor.stairways.map(ele => ele.center),
              ...floor.portals.map(ele => ele.center)].find(
                  el => Math.abs(Math.sqrt(el.x * el.x + el.y * el.y)) - Math.sqrt(start.x * start.x + start.y * start.y) < tolerance
              ) === undefined) {
              additionalPoints.push(start);
        }
        if (  [...floor.stairways.map(ele => ele.center),
              ...floor.portals.map(ele => ele.center)].find(
                  el => Math.abs(Math.sqrt(el.x * el.x + el.y * el.y)) - Math.sqrt(end.x * end.x + end.y * end.y) < tolerance
              ) === undefined) {
              additionalPoints.push(end);
        }
        this.pfinder.insertPointsToFloorGraph([start, end], cpy, floor.walls);

        // find path in this node system
        const path = this.pfinder.findPathFromTo(cpy.nodes,
            cpy.nodes.find(el => el.x === start.x && el.y === start.y),
            cpy.nodes.find(el => el.x === end.x && el.y === end.y));

       floor.floorGraph.path = new LinePath();
        if (path !== null) {
            for (let i = 1; i < path.length; i++) {
                floor.floorGraph.path.path.push(new Line(
                    new Point(path[i].x, path[i].y, false),
                    new Point(path[i - 1].x, path[i - 1].y, false)
                ));
            }
        }
    }
}

import { StairNode } from './../lib/stair-node.class';
import { FloorGraph } from './../lib/floor-graph.class';
import { Floor } from './floor.class';
import { ModelService } from '../svc/model.service';
import { Mouse } from '../svg-edit/mouse.class';


export class Map {
    public id: number;
    public name: string;
    public floors: Floor[];
    public stairGraph: StairNode[];
    public favorite: boolean;
    public permission: number;
    public visibility: number;


    constructor(obj: {
                    id: number, name: string, floors?: any[],
                    favorite: boolean, permission: number, visibility: number
                },
                private modelSvc: ModelService) {
        this.id = obj.id;
        this.name = obj.name;
        this.floors = obj.floors ? obj.floors.map(floor_obj => new Floor(floor_obj)) : null;
        this.favorite = obj.favorite;
        this.permission = obj.permission;
        this.visibility = obj.visibility;
        this.stairGraph = [];
    }


    public createFloor(cloneFrom: Floor = null) {
        if (!cloneFrom) {
            this.floors.push(new Floor({walls: [], portals: [], stairways: [], label: ''}));
        } else {
            this.floors.push(new Floor(cloneFrom.forExport()));
        }
    }

    moveFloor(floor: Floor, direction: number): number {
        const floorId = this.floors.indexOf(floor);
        if (direction === 1 && floorId > -1 && floorId < this.floors.length - 1) {
            const tmpFloor = this.floors[floorId];
            const newFloorId = floorId + 1;
            this.floors[floorId] = this.floors[newFloorId];
            this.floors[newFloorId] = tmpFloor;
            return newFloorId;
        }
        return floorId;
    }

    removeFloor(floor: Floor) {
        const floorId = this.floors.indexOf(floor);
        if (this.floors.length > 1 && floorId !== -1) {
            this.floors.splice(floorId, 1);
        }
    }

    public forExport() {
        return {
            id: this.id,
            name: this.name,
            floors: this.floors.map(floor => floor.forExport()),
            favorite: this.favorite,
            permission: this.permission,
            visibility: this.visibility
        };
    }

    public zoom(scale: number, mouse: Mouse = null, x: number = null, y: number = null, dangling = false) {
        const startCanvasWidth = 2000 / this.modelSvc.zoom;
        let sizeX = startCanvasWidth / scale;
        if (sizeX < 100) sizeX = 100;
        if (mouse && x && y) {
            const ratio = startCanvasWidth / this.modelSvc.viewportSize.x;
            this.modelSvc.panOffset.x = mouse.x - (x - this.modelSvc.bodyOffset.x) * ratio / scale;
            this.modelSvc.panOffset.y = mouse.y - (y - this.modelSvc.bodyOffset.y) * ratio / scale;
        }
        this.updateCanvasSize(sizeX, 1, dangling);
    }

    private getAllPoints() {
        return this.floors.map(floor => floor.getAllPoints()).reduce((first, second) => first.concat(second), []);
    }

    public fitToViewport() {
        this.getMapDimensions();
        const allPoints = this.getAllPoints();
        if (allPoints.length) {
            const topLeft = allPoints[0].clone();
            const bottomRight = allPoints[0].clone();
            for (const point of allPoints) {
                if (point.x < topLeft.x) topLeft.x = point.x;
                if (point.y < topLeft.y) topLeft.y = point.y;
                if (point.x > bottomRight.x) bottomRight.x = point.x;
                if (point.y > bottomRight.y) bottomRight.y = point.y;
            }
            const margin = 100;
            this.modelSvc.panOffset.setCoords(topLeft.x - margin, topLeft.y - margin);
            const width = bottomRight.x - topLeft.x + 2 * margin;
            const height = bottomRight.y - topLeft.y + 2 * margin;
            this.updateCanvasSize(width, height);
        } else {
            this.modelSvc.panOffset.setCoords(0, 0);
            this.updateCanvasSize(2000, 1);
        }
    }

    public updateCanvasSize(width: number, height: number, dangling = false) {
        if (width / height < this.modelSvc.viewportSize.x / this.modelSvc.viewportSize.y) {
            this.modelSvc.canvasSize.x = height * this.modelSvc.viewportSize.x / this.modelSvc.viewportSize.y;
            this.modelSvc.canvasSize.y = height;
        } else {
            this.modelSvc.canvasSize.x = width;
            this.modelSvc.canvasSize.y = width * this.modelSvc.viewportSize.y / this.modelSvc.viewportSize.x;
        }
        if (!dangling) this.modelSvc.zoom = 2000 / this.modelSvc.canvasSize.x;
    }

    public getMapDimensions() {
        const domElement = document.getElementById('editorCanvas').getBoundingClientRect();
        this.modelSvc.viewportSize.x = domElement.width;
        this.modelSvc.viewportSize.y = domElement.height;
        this.modelSvc.bodyOffset.x = domElement.left;
        this.modelSvc.bodyOffset.y = domElement.top;
    }

    public search(query: string) {
        query = query.toLowerCase();
        for (const floor of this.floors) {
            floor.search(query);
        }
    }
}

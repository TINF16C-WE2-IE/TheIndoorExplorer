import { TeleporterNode } from '../pathlib/teleporter-node.class';
import { Floor } from './floor.class';
import { ModelService } from '../svc/model.service';
import { Mouse } from '../svg-edit/mouse.class';
import { Selectable } from './selectable.interface';
import { Point } from './point.class';
import { Teleporter } from './teleporter.interface';


export class Map {
    public id: number;
    public name: string;
    public floors: Floor[];
    public stairGraph: TeleporterNode[];
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
            this.floors.push(new Floor({
                walls: [], portals: [], stairways: [], elevators: [],
                label: String(Math.max(0, ...this.floors.map(floor => Number.parseInt(floor.label, 10))
                                                 .filter(n => !Number.isNaN(n))) + 1)
            }));
        } else {
            this.floors.push(new Floor(cloneFrom.forExport()));
        }
    }

    moveFloor(floor: Floor, direction: number): number {
        const floorId = this.floors.indexOf(floor);
        if (floorId + direction > -1 && floorId + direction < this.floors.length) {
            const tmpFloor = this.floors[floorId];
            const newFloorId = floorId + direction;
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
        // default canvas width: 2000
        const startCanvasWidth = 2000 / this.modelSvc.zoom;
        const sizeX = this.boundZoom(startCanvasWidth / scale);
        scale = startCanvasWidth / sizeX;
        // mouse centered zoom (relative to zoom start)
        if (mouse && x && y) {
            const ratio = startCanvasWidth / this.modelSvc.viewportSize.x;
            // get offset to top left viewport corner, convert to canvas pixels, apply dangling scale, diff with original mouse position
            this.modelSvc.panOffset.x = mouse.x - (x - this.modelSvc.bodyOffset.x) * ratio / scale;
            this.modelSvc.panOffset.y = mouse.y - (y - this.modelSvc.bodyOffset.y) * ratio / scale;
        }
        this.updateCanvasSize(sizeX, 1, dangling);
    }

    private boundZoom(sizeX: number) {
        if (sizeX < 200 || sizeX > 10000) {
            // zoom bounds reached, reset to respective zoom bound
            return Math.min(Math.max(sizeX, 200), 10000);
        }
        return sizeX;
    }

    private getAllPoints(): Point[] {
        return this.floors.reduce((pointList, floor) => pointList.concat(floor.getAllPoints()), []);
    }

    public getAllSelectables(): Selectable[] {
        return this.floors.reduce((selectablesList, floor) => selectablesList.concat(floor.getAllSelectables()), []);
    }

    public getAllTeleporters(): Teleporter[] {
        return this.floors.reduce((teleportersList, floor) => teleportersList.concat(floor.getAllTeleporters()), []);
    }

    public fitToViewport() {
        this.getMapDimensions();
        const allPoints = this.getAllPoints();
        if (allPoints.length) {
            const topLeft = allPoints[0].clone();
            const bottomRight = allPoints[0].clone();
            // find bounding points
            for (const point of allPoints) {
                if (point.x < topLeft.x) topLeft.x = point.x;
                if (point.y < topLeft.y) topLeft.y = point.y;
                if (point.x > bottomRight.x) bottomRight.x = point.x;
                if (point.y > bottomRight.y) bottomRight.y = point.y;
            }
            const margin = 100;
            this.modelSvc.panOffset.x = topLeft.x - margin;
            this.modelSvc.panOffset.y = topLeft.y - margin;
            const width = bottomRight.x - topLeft.x + 2 * margin;
            const height = bottomRight.y - topLeft.y + 2 * margin;
            this.updateCanvasSize(width, height);
        } else {
            this.modelSvc.panOffset.x = 0;
            this.modelSvc.panOffset.y = 0;
            this.updateCanvasSize(2000, 1);
        }
    }

    public updateCanvasSize(width: number, height: number, dangling = false) {
        // fit required canvas section into viewport (as aspect ratio won't match)
        width = this.boundZoom(width);
        if (width / height < this.modelSvc.viewportSize.x / this.modelSvc.viewportSize.y) {
            this.modelSvc.canvasSize.x = height * this.modelSvc.viewportSize.x / this.modelSvc.viewportSize.y;
            this.modelSvc.canvasSize.y = height;
        } else {
            this.modelSvc.canvasSize.x = width;
            this.modelSvc.canvasSize.y = width * this.modelSvc.viewportSize.y / this.modelSvc.viewportSize.x;
        }
        // update zoom var if we're not in continuous zoom mode (i.e. pinch to zoom)
        if (!dangling) this.modelSvc.zoom = 2000 / this.modelSvc.canvasSize.x;
    }

    public getMapDimensions() {
        const domElement = this.modelSvc.editorCanvas.nativeElement.getBoundingClientRect();
        if (
            this.modelSvc.viewportSize.x !== domElement.width ||
            this.modelSvc.viewportSize.y !== domElement.height ||
            this.modelSvc.bodyOffset.x !== domElement.left ||
            this.modelSvc.bodyOffset.y !== domElement.top
        ) {
            this.modelSvc.viewportSize.x = domElement.width;
            this.modelSvc.viewportSize.y = domElement.height;
            this.modelSvc.bodyOffset.x = domElement.left;
            this.modelSvc.bodyOffset.y = domElement.top;
            this.updateCanvasSize(this.modelSvc.canvasSize.x, 1);
        }
    }

    public search(query: string) {
        query = query.toLowerCase();
        for (const floor of this.floors) {
            floor.search(query);
        }
    }
}

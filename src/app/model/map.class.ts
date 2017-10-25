import { Floor } from './floor.class';
import { ModelService } from '../svc/model.service';


export class Map {
    public id: number;
    public name: string;
    public floors: Floor[];
    public favorite: boolean;
    public permission: number;
    public visibility: number;

    private modelSvc: ModelService;


    constructor(obj: {
        id: number, name: string, floors?: any[],
        favorite: boolean, permission: number, visibility: number
    }, modelSvc: ModelService) {
        this.id = obj.id;
        this.name = obj.name;
        this.floors = obj.floors ? obj.floors.map(floor_obj => new Floor(floor_obj)) : null;
        this.favorite = obj.favorite;
        this.permission = obj.permission;
        this.visibility = obj.visibility;

        this.modelSvc = modelSvc;
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

    public zoom(direction: number, x: number = null, y: number = null) {
        if (Math.abs(direction) !== 1) direction = 0;
        const sizeX = this.modelSvc.canvasSize.x + 25 * direction;
        const sizeY = this.modelSvc.canvasSize.y + 25 * direction;
        this.modelSvc.canvasSize.x = sizeX < 100 ? 100 : sizeX;
        this.modelSvc.canvasSize.y = sizeY < 100 ? 100 : sizeY;
        if (x && y) {
            this.modelSvc.panOffset.x += (x - this.modelSvc.bodyOffset.x - this.modelSvc.viewportSize.x / 2) / 10;
            this.modelSvc.panOffset.y += (y - this.modelSvc.bodyOffset.y - this.modelSvc.viewportSize.y / 2) / 10;
        }
    }

    public fitToViewport() {
        const allPoints = this.modelSvc.currentFloor.getAllPoints();
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
        this.updateCanvasSize(bottomRight.x - topLeft.x + 2 * margin);
        console.log(this.modelSvc.viewportSize);
    }

    public updateCanvasSize(width: number) {
        this.modelSvc.canvasSize.x = width;
        console.log(this.modelSvc.viewportSize);
        this.modelSvc.canvasSize.y = this.modelSvc.canvasSize.x * this.modelSvc.viewportSize.y / this.modelSvc.viewportSize.x;
    }
}

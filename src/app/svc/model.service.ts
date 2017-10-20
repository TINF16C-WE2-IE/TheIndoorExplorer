import { Map } from '../model/map.class';
import { Injectable } from '@angular/core';
import { RequestService } from './request.service';


@Injectable()
export class ModelService {

    public mapsList: Map[];
    public currentMapId: number;
    public currentFloorId: number;

    public get currentMap(): Map {
        return this.mapsList[this.currentMapId];
    }

    public set currentMap(value: Map) {
        this.mapsList.push(value);
        this.currentMapId = this.mapsList.length - 1;
    }

    public get currentFloor() {
        if (this.currentMap) {
            return this.currentMap.floors[this.currentFloorId];
        }
        else {
            return null;
        }
    }

    constructor(private rqstSvc: RequestService) {
        this.mapsList = [];
        this.currentMapId = 0;
        this.currentFloorId = 0;
    }

    public loadMap(mapId: string) {
        this.rqstSvc.get(RequestService.LIST_MAP_DETAILS, {'mapid': mapId})
            .subscribe(resp => {
                console.log('got response map details: ', resp);
                if (resp !== null) {
                    this.currentMap = new Map(resp);
                }
            });
    }

    public saveMap() {
        this.rqstSvc.post(RequestService.LIST_MAP_SAVE, {'map': this.currentMap})
            .subscribe(resp => {
                console.log('got response map-save: ', resp);
                if (resp !== null) {
                    // TODO
                }
            });
    }

}

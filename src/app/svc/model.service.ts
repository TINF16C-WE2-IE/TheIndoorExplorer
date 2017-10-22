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
        if (mapId === '-1') {
            this.currentMap = new Map({
                id: '-1',
                name: 'New Map',
                floors: [{
                    walls: [{p1: {x: 50, y: 50}, p2: {x: 250, y: 50}}],
                    portals: [{id: 1, label: 'main door', p1: {x: 100, y: 100}, p2: {x: 250, y: 250}}]
                }],
                favorite: false,
                permission: 0,
                visibility: 0
            });
        }
        else {
            this.rqstSvc.get(RequestService.LIST_MAP_DETAILS, {'mapid': mapId})
                .subscribe(resp => {
                    console.log('got response map details: ', resp);
                    if (resp !== null) {
                        this.currentMap = new Map(resp);
                    }
                });
        }
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

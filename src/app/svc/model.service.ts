import { Floor } from './../model/floor.class';
import { Selectable } from './../model/selectable.interface';
import { Point } from './../model/point.class';
import { Line } from './../model/line.class';
import { Pathfinder } from './../lib/pathfinder.class';
import { Map } from '../model/map.class';
import { Injectable } from '@angular/core';
import { RequestService } from './request.service';


@Injectable()
export class ModelService {

    public maps: {[id: number]: Map};
    public currentMapId: number;
    public currentFloorId: number;
    public selectedObjects: Selectable[] = [];
    public movingPath: Line[] = [];
    public userInfo: {id: number, username: string};

    public viewportSize: {x: number, y: number} = {x: 500, y: 500};
    public canvasSize: {x: number, y: number} = {x: 500, y: 500};
    public panOffset = new Point(0, 0);
    public bodyOffset = new Point(0, 0);
    public zoom = 1;

    public get currentMap() {
        return this.maps[this.currentMapId];
    }

    public set currentMap(value: Map) {
        this.currentMapId = value.id;
        this.maps[this.currentMapId] = value;
    }

    public get currentFloor() {
        if (this.currentMap && this.currentMap.floors) {
            return this.currentMap.floors[this.currentFloorId];
        }
        else {
            return null;
        }
    }

    public setCurrentFloor(id: number) {
        this.currentFloorId = id;
    }

    constructor(private rqstSvc: RequestService) {
        this.maps = {};
        this.currentMapId = 0;
        this.currentFloorId = 0;
        this.userInfo = null;
    }

    public loadUserInfo() {
        this.rqstSvc.get(RequestService.INFO_USER, {}).subscribe(
            resp => {
                if (resp) {
                    console.log('got user info:', resp);
                    this.userInfo = resp;
                }
            }
        );
    }

    public loadMapList() {
        this.rqstSvc.get(RequestService.LIST_MAPS, {}).subscribe(
            resp => {
                if (resp) {
                    for (const mapInfo of resp as [
                        {id: number, name: string, favorite; boolean, permission: number, visibility: number}
                        ]) {
                        this.maps[mapInfo.id] = new Map(mapInfo, this);
                    }
                }
            }
        );
    }

    public loadMap(mapId: number) {
        if (mapId === -1) {
            this.currentMap = new Map({
                id: -1,
                name: 'New Map',
                floors: [{
                    walls: [],
                    portals: [],
                    label: ''
                }],
                favorite: false,
                permission: 0,
                visibility: 0
            }, this);
            this.currentMap.fitToViewport();
        }
        else {
            this.rqstSvc.get(RequestService.LIST_MAP_DETAILS, {'mapid': mapId})
                .subscribe(resp => {
                    console.log('got response map details: ', resp);
                    if (resp !== null) {
                        this.currentMap = new Map(resp, this);
                        this.currentMap.fitToViewport();
                    }
                });
        }
    }

    public saveMap() {
        this.rqstSvc.post(RequestService.LIST_MAP_SAVE, this.currentMap.forExport())
            .subscribe(resp => {
                console.log('got response map-save: ', resp);
                if (resp !== null) {
                    // TODO
                }
            });
    }


}

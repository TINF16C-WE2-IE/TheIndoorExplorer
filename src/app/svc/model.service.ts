import { Selectable } from './../model/selectable.interface';
import { Point } from './../model/point.class';
import { Map } from '../model/map.class';
import { ElementRef, Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Stairs } from '../model/stairs.class';


@Injectable()
export class ModelService {

    public maps: {[id: number]: Map};
    public currentMapId: number;
    public currentFloorId: number;
    public userInfo: {id: number, username: string};

    private _selectedObjects: Selectable[] = [];
    public connectibleStairsGroups: StairsGroup[] = [];

    public editorCanvas: ElementRef;
    public viewportSize: {x: number, y: number} = {x: 500, y: 500};
    public canvasSize: {x: number, y: number} = {x: 500, y: 500};
    public panOffset: {x: number, y: number} = {x: 0, y: 0};
    public bodyOffset: {x: number, y: number} = {x: 0, y: 0};
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
        } else {
            return null;
        }
    }

    public get selectedObjects(): Selectable[] {
        return this._selectedObjects;
    }

    public set selectedObjects(value: Selectable[]) {
        this._selectedObjects = value;
        this.updateConnectibleStairsGroups();
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

    public loadMap(mapId: number, callback: () => void = () => {
    }) {
        if (mapId === -1) {
            const newMap = new Map({
                id: -1,
                name: 'New Map',
                floors: [],
                favorite: false,
                permission: 0,
                visibility: 0
            }, this);
            newMap.createFloor();
            newMap.fitToViewport();
            this.currentMap = newMap;
            callback();
        } else {
            this.rqstSvc.get(RequestService.LIST_MAP_DETAILS + mapId, {}).subscribe(
                resp => {
                    if (resp !== null) {
                        this.currentMap = new Map(resp, this);
                        this.currentMap.fitToViewport();
                        callback();
                    }
                }
            );
        }
    }

    public saveMap() {
        this.rqstSvc.post(RequestService.LIST_MAP_SAVE + this.currentMapId, this.currentMap.forExport())
            .subscribe(resp => {
                console.log('got response map-save: ', resp);
                if (resp !== null) {
                    // TODO
                }
            });
    }

    public deleteMap() {
        this.rqstSvc.delete(RequestService.DELETE_MAP + this.currentMapId, {})
            .subscribe(resp => {
                console.log('got response map-save: ', resp);
                if (resp !== null) {
                    // TODO
                }
            });
    }

    public publishMap() {
        this.rqstSvc.post(RequestService.PUBLISH + this.currentMapId + '/publish', {})
            .subscribe(resp => {
                console.log('got response map-save: ', resp);
                if (resp !== null) {
                    // TODO
                }
            });
    }

    updateConnectibleStairsGroups() {
        const stairsGroups: StairsGroup[] = [];
        for (const stairs of this.currentMap.floors
                                 .reduce((stairsList, floor) => stairsList.concat(floor.stairways), []) as Stairs[]) {
            if (stairs.group !== null) {
                const foundGroup = stairsGroups.find(grp => grp.group === stairs.group);
                if (foundGroup) {
                    foundGroup.stairways.push(stairs);
                }
                else {
                    stairsGroups.push({group: stairs.group, stairways: [stairs]});
                }
            }
        }
        this.connectibleStairsGroups = stairsGroups;
    }
}


export interface StairsGroup {
    group: number;
    stairways: Stairs[];
}

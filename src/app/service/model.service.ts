import { MessageService } from './message.service';
import { ElementRef, Injectable } from '@angular/core';
import { Elevator } from '../model/elevator.class';
import { Map } from '../model/map.class';
import { Selectable } from '../model/selectable.interface';
import { Stairs } from '../model/stairs.class';
import { TeleporterGroup } from '../model/teleporter-group.interface';
import { Teleporter } from '../model/teleporter.interface';
import { RequestService } from './request.service';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';


@Injectable()
export class ModelService {

    public maps: {[id: number]: Map};
    public currentMapId: number;
    public currentFloorId: number;

    private _selectedObjects: Selectable[] = [];
    public connectibleTeleporterGroups: TeleporterGroup[] = [];
    public backgroundImageDataURL: string = null;
    public editorCanvas: ElementRef;
    public viewportSize: {x: number, y: number} = {x: 500, y: 500};
    public canvasSize: {x: number, y: number} = {x: 500, y: 500};
    public panOffset: {x: number, y: number} = {x: 0, y: 0};
    public bodyOffset: {x: number, y: number} = {x: 0, y: 0};
    public zoom = 1;

    public get currentMap() {
        return this.maps[this.currentMapId] || null;
    }

    public set currentMap(value: Map) {
        this.currentMapId = value.id;
        this.maps[this.currentMapId] = value;
    }

    public get currentFloor() {
        if (this.currentMap && this.currentMap.floors) {
            return this.currentMap.floors[this.currentFloorId] || null;
        }
        else {
            return null;
        }
    }

    public get selectedObjects(): Selectable[] {
        return this._selectedObjects;
    }

    public set selectedObjects(value: Selectable[]) {
        this._selectedObjects = value;
        this.updateConnectibleTeleporterGroups();
    }

    public get singleSelectedObject(): Selectable {
        if (this.selectedObjects.length === 1) {
            return this.selectedObjects[0];
        }
        return null;
    }

    public setCurrentFloor(id: number) {
        this.currentFloorId = id;
    }

    constructor(private rqstSvc: RequestService, private msgSvc: MessageService) {
        this.maps = {};
        this.currentMapId = 0;
        this.currentFloorId = 0;
    }


    public loadMapList() {
        this.rqstSvc.get(RequestService.LIST_MAPS, {}).subscribe(
            resp => {
                console.log(resp);
                if (resp.status >= 200 && resp.status <= 299 && resp.data) {
                    for (const mapInfo of resp.data as [
                        {id: number, name: string, favorite: boolean, permission: number, visibility: number}
                        ]) {
                        this.maps[mapInfo.id] = new Map(mapInfo, this);
                    }
                } else {
                    console.log('Received invalid map list response:', resp);
                }
            }
        );
    }

    public loadMap(mapId: number): Observable<boolean> {
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
            return Observable.of(true);
        }
        else {
            return Observable.create((observer: Observer<boolean>) => {

                this.rqstSvc.get(RequestService.LIST_MAP_DETAILS + mapId, {}).subscribe(
                    resp => {
                        if (resp.status >= 200 && resp.status <= 299 && resp.data) {
                            this.currentMap = new Map(resp.data, this);
                            this.currentMap.fitToViewport();
                            observer.next(true);
                        }
                        else {
                            console.log('Received invalid map response:', resp);
                            observer.next(false);
                        }
                        observer.complete();
                    },
                    error => {
                        console.log('Received error map response:', error.status, error.statusText, error.url);
                        observer.next(false);
                        observer.complete();
                    }
                );

            });
        }
    }

    public saveMap(callback: (newMapId: number) => void) {
        this.rqstSvc.post(RequestService.LIST_MAP_SAVE + this.currentMapId, this.currentMap.forExport())
            .subscribe(
                resp => {
                    if (resp.status >= 200 && resp.status <= 299) {
                        this.msgSvc.notify('Map was successfully saved', 'Success');
                        if (resp.data && resp.data.mapId) {
                            this.currentMap.id = resp.data.mapId;
                            callback(resp.data.mapId);
                        }
                    }
                },
                error => {
                    this.msgSvc.notify('Could not save map :(', 'Error');
                }
            );
    }

    public deleteMap(callback: () => void) {
        this.rqstSvc.delete(RequestService.DELETE_MAP + this.currentMapId, {})
            .subscribe(resp => {
                console.log('got response map-delete:', resp);
                if (resp.status >= 200 && resp.status <= 299 && resp.data && resp.data.mapId) {
                    delete this.maps[this.currentMapId];
                    callback();
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

    updateConnectibleTeleporterGroups() {
        let teleporters: Teleporter[] = [];
        if (this.selectedObjects.length === 1) {
            if (this.selectedObjects[0] instanceof Stairs) {
                teleporters = this.currentMap.floors.reduce((stairsList, floor) => stairsList.concat(floor.stairways), []);
            }
            else if (this.selectedObjects[0] instanceof Elevator) {
                teleporters = this.currentMap.floors.reduce((elevatorList, floor) => elevatorList.concat(floor.elevators), []);
            }
        }

        const teleporterGroups: TeleporterGroup[] = [];
        for (const teleporter of teleporters) {
            if (teleporter.group !== null) {
                const foundGroup = teleporterGroups.find(grp => grp.group === teleporter.group);
                if (foundGroup) {
                    foundGroup.members.push(teleporter);
                }
                else {
                    teleporterGroups.push({group: teleporter.group, members: [teleporter]});
                }
            }
        }
        this.connectibleTeleporterGroups = teleporterGroups;
    }

}

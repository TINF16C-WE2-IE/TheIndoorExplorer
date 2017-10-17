import { Map } from '../model/map.class';
import { Injectable } from '@angular/core';
import { Floor } from '../model/floor.class';
import { RequestService } from './request.service';


@Injectable()
export class ModelService {

    public mapsList: Map[];
    public curEditMapId: number;
    public curEditMapLevel: number;

    public get curEditMap(): Map {
        return this.mapsList[this.curEditMapId];
    }

    public set curEditMap(value: Map) {
        this.mapsList.push(value);
        this.curEditMapId = this.mapsList.length - 1;
    }


    constructor(private rqstSvc: RequestService) {
        this.mapsList = [new Map(false, '', '', 0, [new Floor([], [])])];
        this.curEditMapId = 0;
        this.curEditMapLevel = 0;
    }

    public loadMap(mapId: string) {
        this.rqstSvc.get(RequestService.LIST_MAP_DETAILS, {'mapid': mapId})
            .subscribe(resp => {
                console.log('got response map details: ', resp);
                if (resp !== null) {
                    this.curEditMap = resp;
                }
            });
    }

    public saveMap() {
        this.rqstSvc.post(RequestService.LIST_MAP_SAVE, {'map': this.curEditMap})
            .subscribe(resp => {
                console.log('got response map-save: ', resp);
                if (resp !== null) {
                    // TODO
                }
            });
    }
}

import { Pathfinder } from './../lib/pathfinder.class';
import { Map } from './../model/map.class';
import { Injectable } from '@angular/core';


@Injectable()
export class ModelService {

    public mapsList: Map[];
    public curEditMap: Map;
    public curEditMapLevel: number;

    constructor() {
        this.curEditMapLevel = 0;
        this.curEditMap = new Map(false, '', '', 0, [{walls: [], doors: []}]);
        this.mapsList = [];

        // Pathfinding debug test
        const p = new Pathfinder();
        p.debugTest();
    }
}

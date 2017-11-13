import { Component, Input, OnInit } from '@angular/core';
import { Floor } from '../../model/floor.class';
import { ModelService } from '../../service/model.service';

@Component({
    selector: 'app-floor-controls',
    templateUrl: './floor-controls.component.html',
    styleUrls: ['./floor-controls.component.css']
})
export class FloorControlsComponent implements OnInit {

    public get currentMap() {
        return this.modelSvc.currentMap;
    }

    get floors() {
        return this.modelSvc.currentMap && this.modelSvc.currentMap.floors;
    }

    get currentFloor() {
        return this.modelSvc.currentFloor;
    }


    @Input() editMode = false;


    constructor(private modelSvc: ModelService) {
    }


    ngOnInit() {
    }

    selectFloor(id: number) {
        this.modelSvc.setCurrentFloor(id);
    }

    createFloor(cloneFrom: Floor = null) {
        this.currentMap.createFloor(cloneFrom);
        this.selectFloor(this.floors.length - 1);
    }

    moveFloor(floor: Floor, direction: number) {
        const newPos = this.currentMap.moveFloor(floor, direction);
        this.selectFloor(newPos);
    }

    removeFloor(floor: Floor) {
        this.selectFloor(0);
        this.currentMap.removeFloor(floor);
    }

}

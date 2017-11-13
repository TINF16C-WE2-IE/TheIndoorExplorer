import { Component, OnInit } from '@angular/core';
import { Elevator } from '../../model/elevator.class';
import { Floor } from '../../model/floor.class';
import { Selectable } from '../../model/selectable.interface';
import { Stairs } from '../../model/stairs.class';
import { TeleporterGroup } from '../../model/teleporter-group.interface';
import { isTeleporter, Teleporter } from '../../model/teleporter.interface';
import { ModelService } from '../../service/model.service';
import { ToolService } from '../../service/tool.service';

@Component({
    selector: 'app-side-properties',
    templateUrl: './side-properties.component.html',
    styleUrls: ['./side-properties.component.css']
})
export class SidePropertiesComponent implements OnInit {

    public get floors(): Floor[] {
        return this.modelSvc.currentMap && this.modelSvc.currentMap.floors;
    }

    public get currentFloor(): Floor {
        return this.modelSvc.currentFloor;
    }

    public get singleSelectedObject(): Selectable {
        return this.modelSvc.singleSelectedObject;
    }

    get connectibleTeleporterGroups() {
        return this.modelSvc.connectibleTeleporterGroups;
    }


    constructor(private modelSvc: ModelService, private toolSvc: ToolService) {
    }

    ngOnInit() {
    }

    getTeleporterGroupDisplayName(teleporterGroup: TeleporterGroup) {
        return 'Group ' + teleporterGroup.group + ': ' +
            teleporterGroup.members.map(teleporter => {
                const floor = this.floors.find(fl => {
                    return fl.stairways.indexOf(teleporter as Stairs) !== -1
                        || fl.elevators.indexOf(teleporter as Elevator) !== -1;
                });
                const floorIndex = this.floors.indexOf(floor);
                return {index: floorIndex, floorLabel: (floor.label || '?'), stairsLabel: (teleporter.label || '?')};
            }).sort((a, b) => {
                return (a.index - b.index) || a.stairsLabel.toUpperCase().localeCompare(b.stairsLabel.toUpperCase());
            }).map(obj => {
                return obj.stairsLabel + ' (' + obj.floorLabel + ')';
            }).join(', ');
    }

    setTeleporterGroup(teleporter: Teleporter, group: number) {
        if (isTeleporter(this.singleSelectedObject)) {
            if (group === undefined) {  // new Group
                teleporter.group = Math.max(
                    0, ...this.connectibleTeleporterGroups
                              .reduce((groupsList, teleporterGroup) => groupsList.concat(teleporterGroup.group), [])
                ) + 1;
            }
            else {
                teleporter.group = group;
            }
        }
        this.modelSvc.updateConnectibleTeleporterGroups();
        this.markDirty();
    }

    markDirty() {
        this.modelSvc.currentMap.dirty = true;
    }

}

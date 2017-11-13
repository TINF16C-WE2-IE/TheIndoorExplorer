import { Component, OnInit } from '@angular/core';
import { Floor } from '../../model/floor.class';
import { Selectable } from '../../model/selectable.interface';
import { ModelService } from '../../service/model.service';
import { ToolService } from '../../service/tool.service';
import { DirectionsTool } from '../../service/toolbox/directions-tool.class';

@Component({
    selector: 'app-side-search',
    templateUrl: './side-search.component.html',
    styleUrls: ['./side-search.component.css']
})
export class SideSearchComponent implements OnInit {

    public searchQuery = '';
    public startQuery = '';
    public endQuery = '';
    public startpoint = true;

    public get currentMap() {
        return this.modelSvc.currentMap;
    }

    public get floors(): Floor[] {
        return this.modelSvc.currentMap && this.modelSvc.currentMap.floors;
    }

    public get singleSelectedObject(): Selectable {
        return this.modelSvc.singleSelectedObject;
    }

    constructor(private modelSvc: ModelService, private toolSvc: ToolService) {
    }

    ngOnInit() {
    }


    selectWaypoint(selected: Selectable) {
        if (this.toolSvc.selectedTool instanceof DirectionsTool) {
            this.toolSvc.selectedTool.selectWaypoint(selected);
        }
    }

    search(query: string) {
        console.log('search', query);
        this.currentMap.search(query);
        this.currentMap.fitToViewport();
    }

}

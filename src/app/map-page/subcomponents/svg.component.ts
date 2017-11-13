import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Floor } from '../../model/floor.class';
import { Map } from '../../model/map.class';
import { Selectable } from '../../model/selectable.interface';
import { LinePath } from '../../pathlib/line-path.class';
import { ModelService } from '../../service/model.service';
import { ToolService } from '../../service/tool.service';
import { Mouse } from '../../service/toolbox/mouse.class';
import { Tool } from '../../service/toolbox/tool.class';

@Component({
    selector: 'app-svg',
    templateUrl: './svg.component.html',
    styleUrls: ['./svg.component.css']
})
export class SvgComponent implements OnInit {

    public get currentMap(): Map {
        return this.modelSvc.currentMap;
    }

    public get currentFloor(): Floor {
        return this.modelSvc.currentFloor;
    }

    public get mouse(): Mouse {
        return this.toolSvc.mouse;
    }

    public get tool(): Tool {
        return this.toolSvc.selectedTool;
    }

    public get viewBoxString(): string {
        return (this.modelSvc.panOffset.x || 0) + ' ' + (this.modelSvc.panOffset.y || 0) + ' '
            + (this.modelSvc.canvasSize.x || 0) + ' ' + (this.modelSvc.canvasSize.y || 0);
    }

    public get movingPaths(): LinePath[] {
        return this.currentFloor && this.currentFloor.floorGraph.paths || null;
    }


    public get backgroundImageDataURL(): string {
        return this.modelSvc.backgroundImageDataURL;
    }

    @ViewChild('editorCanvas') editorCanvas: ElementRef;
    @Input() editMode = false;
    @Input() showLabels = true;


    constructor(private modelSvc: ModelService, private toolSvc: ToolService) {
    }

    ngOnInit() {
        this.modelSvc.editorCanvas = this.editorCanvas;

    }

    public getSelectableColor(obj: Selectable) {
        if (this.modelSvc.selectedObjects.indexOf(obj) !== -1) return '#0d47a1';
        if (this.currentFloor.searchResults.indexOf(obj) !== -1) return '#b71c1c';
        return '#afafaf';
    }


}

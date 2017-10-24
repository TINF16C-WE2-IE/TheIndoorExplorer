import { ModelService } from '../svc/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Mouse } from './mouse.class';
import { MoveTool } from './toolbox/move-tool.class';
import { LineTool } from './toolbox/line-tool.class';
import { Wall } from '../model/wall.class';
import { Portal } from '../model/portal.class';

@Component({
    selector: 'app-svg-edit',
    templateUrl: './svg-edit.component.html',
    styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {
    mouse: Mouse;

    public toolnames = ['Move', 'Draw Wall', 'Draw Portal'];

    get floor() {
        return this.modelSvc.currentFloor;
    }

    constructor(private modelSvc: ModelService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.modelSvc.loadMap(Number.parseInt(params['mapId']));
            }
        );

        this.mouse = new Mouse();
        this.selectTool('Move');
    }

    selectTool($event: any) {
        console.log($event);
        switch ($event) {
            case 'Move':
              this.mouse.tool = new MoveTool(this.mouse, this.modelSvc);
              break;
            case 'Draw Wall':
              this.mouse.tool = new LineTool(this.mouse, this.modelSvc, {lineType: Wall});
              break;
            case 'Draw Portal':
              this.mouse.tool = new LineTool(this.mouse, this.modelSvc, {lineType: Portal});
              break;
        }
    }

    saveCurrentMap() {
        this.modelSvc.saveMap();
    }
}

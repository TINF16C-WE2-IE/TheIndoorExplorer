import { ModelService } from '../svc/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Mouse } from './mouse.class';
import { MoveTool } from './toolbox/move-tool.class';
import { LineTool } from './toolbox/line-tool.class';

@Component({
    selector: 'app-svg-edit',
    templateUrl: './svg-edit.component.html',
    styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {
    mouse: Mouse;

    get floor() {
        return this.modelSvc.currentFloor;
    }

    constructor(private modelSvc: ModelService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.modelSvc.loadMap(params['mapId']);
            }
        );

        this.mouse = new Mouse();
        this.selectMoveTool();
    }

    selectMoveTool() {
        this.mouse.tool = new MoveTool(this.mouse, this.modelSvc);
    }

    selectLineTool() {
        this.mouse.tool = new LineTool(this.mouse, this.modelSvc);
    }
}

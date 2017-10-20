import { ModelService } from '../svc/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Mouse } from './mouse.class';
import { Point } from '../model/point.class';
import { MoveTool } from './toolbox/move-tool';

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

        const rect = document.getElementById('editorCanvas').getBoundingClientRect();
        const canvasOffset = new Point(rect.left, rect.top);
        this.mouse = new Mouse(canvasOffset);
        this.selectMoveTool();
    }

    selectMoveTool() {
        this.mouse.tool = new MoveTool(this.mouse, this.modelSvc);
    }
}

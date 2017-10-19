import { ModelService } from '../svc/model.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { Mouse } from './mouse.class';
import { Point } from '../model/point.class';

@Component({
    selector: 'app-svg-edit',
    templateUrl: './svg-edit.component.html',
    styleUrls: ['./svg-edit.component.css']
})
export class SvgEditComponent implements OnInit {

    public get currentFloor() {
        if (this.modelSvc.curEditMap) {
            return this.modelSvc.curEditMap.map[this.modelSvc.curEditMapLevel];
        }
        else {
            return null;
        }
    }

    mouse: Mouse;

    constructor(public modelSvc: ModelService, private route: ActivatedRoute, private router: Router) {
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
    }


}

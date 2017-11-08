import {Component, OnInit} from '@angular/core';
import {ModelService} from '../../svc/model.service';

@Component({
    selector: 'app-delete-map-dialog',
    templateUrl: './delete-map-dialog.component.html',
    styleUrls: ['./delete-map-dialog.component.css']
})
export class DeleteMapDialogComponent implements OnInit {

    constructor(private modelSvc: ModelService) {
    }

    ngOnInit() {
    }

    public deleteMap() {
        this.modelSvc.deleteMap();
    }
}

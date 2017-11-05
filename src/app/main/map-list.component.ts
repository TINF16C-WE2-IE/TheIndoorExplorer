import {MessageService} from '../svc/message.service';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import 'rxjs/add/observable/of';

import {ModelService} from '../svc/model.service';
import {RequestService} from '../svc/request.service';
import {Map} from '../model/map.class';


@Component({
    selector: 'app-map-list',
    templateUrl: './map-list.component.html',
    styleUrls: ['./map-list.component.css']
})
export class MapListComponent implements OnInit {

    public get maps(): Map[] {
        return Object.keys(this.modelSvc.maps).map(key => this.modelSvc.maps[key]);
    }
    constructor(private msgSvc: MessageService, private rqstSvc: RequestService, private modelSvc: ModelService,
                private changeRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.modelSvc.loadMapList();
    }

}

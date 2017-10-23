import { MessageService } from '../svc/message.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/of';

import { ModelService } from '../svc/model.service';
import { RequestService } from '../svc/request.service';
import { Map } from '../model/map.class';

@Component({
    selector: 'app-content-maps',
    templateUrl: 'maps.component.html'
})
export class MapsComponent implements OnInit {

    public get maps(): Map[] {
        return Object.keys(this.modelSvc.maps).map(key => this.modelSvc.maps[key]);
    }

    constructor(private msgSvc: MessageService, private rqstSvc: RequestService, private modelSvc: ModelService,
                private changeRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.modelSvc.loadMapList();
    }

    public setFavorite(mapId: string): void {
        this.msgSvc.notify('TODO: set favorite map. Send request to server.');

        const selectedMap = this.maps[Number.parseInt(mapId)];
        if (selectedMap !== undefined) {
            // TODO.
        }
    }
}

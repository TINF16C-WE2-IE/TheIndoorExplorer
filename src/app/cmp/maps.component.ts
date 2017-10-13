import { MessageService } from './../svc/message.service';
import {ChangeDetectorRef, Component} from '@angular/core';
import 'rxjs/add/observable/of';

import {ModelService} from '../svc/model.service';
import {RequestService} from '../svc/request.service';

@Component({
    selector: 'app-content-maps',
    templateUrl: 'maps.component.html'
})
export class MapsComponent {

    constructor(private msgSvc: MessageService, private rqstSvc: RequestService, public modelSvc: ModelService,
                private changeRef: ChangeDetectorRef) {

        this.rqstSvc.get(RequestService.LIST_MAPS, {}).subscribe(
            resp => {
                if (resp) {
                    this.modelSvc.mapsList = resp;
                }
            }
        );
    }

    public setFavorite(mapId: string): void {
        this.msgSvc.notify('TODO: set favorite map. Send request to server.');

        const selectedMap = this.modelSvc.mapsList.find(element => element.id === mapId);
        if (selectedMap !== undefined) {
            // TODO.
        }
    }
}

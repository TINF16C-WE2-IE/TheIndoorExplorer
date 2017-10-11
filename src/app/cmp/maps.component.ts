import {ChangeDetectorRef, Component} from '@angular/core';
import 'rxjs/add/observable/of';

import {ModelService} from '../svc/model.service';
import {RequestService} from '../svc/request.service';

@Component({
    selector: 'app-content-maps',
    templateUrl: 'maps.component.html'
})
export class MapsComponent {

    constructor(private rqstSvc: RequestService, public modelSvc: ModelService, private changeRef: ChangeDetectorRef) {

        this.rqstSvc.get(RequestService.LIST_MAPS).subscribe(
            resp => {
                console.log('got response maps: ', resp);
                if (resp) {
                    this.modelSvc.mapsList = resp;
                }
            }
        );
    }
}

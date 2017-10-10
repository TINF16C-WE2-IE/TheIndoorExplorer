import { ExampleDataSource } from '../lib/example-data-source.class';
import { Observable } from 'rxjs/Observable';
import { Component, ChangeDetectorRef } from '@angular/core';
import 'rxjs/add/observable/of';

import { ModelService } from './../svc/model.service';
import { RequestService } from './../svc/request.service';

@Component({
  selector: 'app-content-maps',
  templateUrl: 'maps.component.html'
})
export class MapsComponent {

    constructor(private rqstSvc: RequestService, private modelSvc: ModelService, private changeRef: ChangeDetectorRef) {

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

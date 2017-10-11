import { Map } from './../model/map.class';
import { MapDetails } from './../model/map-details.class';
import { Injectable } from '@angular/core';


@Injectable()
export class ModelService {

    public mapsList: Map[];
    public mapDetails: MapDetails;

    constructor() {

    }
}

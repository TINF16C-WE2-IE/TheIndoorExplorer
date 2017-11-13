import { Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/of';
import { Map } from '../model/map.class';

import { ModelService } from '../service/model.service';
import { UserService } from '../service/user.service';


@Component({
    selector: 'app-map-list',
    templateUrl: './map-list.component.html',
    styleUrls: ['./map-list.component.css']
})
export class MapListComponent implements OnInit {

    public get maps(): Map[] {
        return Object.keys(this.modelSvc.maps).map(key => this.modelSvc.maps[Number(key)]);
    }

    public get isLoggedIn(): boolean {
        return this.userSvc.isLoggedIn;
    }

    constructor(private modelSvc: ModelService, private userSvc: UserService) {
    }

    ngOnInit() {
        this.modelSvc.loadMapList().subscribe();
    }

}

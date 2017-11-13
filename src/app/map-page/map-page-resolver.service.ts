import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ModelService } from '../service/model.service';
import { Pathfinder2 } from '../pathlib/pathfinder2.class';
import { Observer } from 'rxjs/Observer';
import { MessageService } from '../service/message.service';

@Injectable()
export class MapPageResolverService implements Resolve<void> {

    constructor(private modelSvc: ModelService, private router: Router, private messageSvc: MessageService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> {

        const urlMapIdString = route.params.mapId;

        return Observable.create((observer: Observer<void>) => {
            this.modelSvc.loadMap(urlMapIdString === 'new' ? -1 : Number.parseInt(urlMapIdString)).subscribe(
                (success) => {
                    if (success) {
                        this.onMapLoaded();
                    }
                    else {
                        this.router.navigate(['']);
                        this.messageSvc.notify('Map not existing or access denied. Are you logged in?');
                    }
                    observer.next(null);
                    observer.complete();
                }
            );
        });

    }


    private onMapLoaded() {
        console.log('building route graph...');
        // initialize connection graphs for pathfinding - function moved from DirectionsTool

        // create the basic nodegraph on each floor, and insert the static elevators and stairs
        for (const f of this.modelSvc.currentMap.floors) {

            // you can set smooth to true. This will result in a bit smoother paths,
            // but also (in the worst case) in twice as much nodes and therefore quadratic more calculation cost!
            f.floorGraph = Pathfinder2.createLinkedFloorGraph([...f.walls], 45, false);
        }

        Pathfinder2.generateTeleporterGraphOnMap(this.modelSvc.currentMap);

        for (const f of this.modelSvc.currentMap.floors) {
            f.floorGraph.paths = [];
        }

        console.log('done!', this.modelSvc.currentMap);
    }
}

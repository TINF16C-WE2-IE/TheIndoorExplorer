import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../service/user.service';
import { ModelService } from '../service/model.service';

@Injectable()
export class MapPageGuardService implements CanActivate, CanDeactivate<CanDeactivateComponent> {

    constructor(private userSvc: UserService, private modelSvc: ModelService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (route.data.requireLogin) {
            if (route.data.requireWritePerm) {
                if (route.params.mapId === 'new') {
                    return this.userSvc.isLoggedIn;
                }
                const mapId = Number.parseInt(route.params.mapId);
                if (!this.userSvc.loaded) {
                    this.router.navigate(['/map', route.params.mapId]);
                    return false;
                }
                if (!this.modelSvc.maps[mapId]) {
                    return this.modelSvc.loadMapList().map(success => {
                        if (success) {
                            return this.modelSvc.maps[mapId] && this.modelSvc.maps[mapId].permission === 1;
                        }
                    });
                }
                return this.modelSvc.maps[mapId].permission === 1;
            }
            return this.userSvc.isLoggedIn;
        }
        return true;
    }


    canDeactivate(component: CanDeactivateComponent, currentRoute: ActivatedRouteSnapshot,
                  currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return component.canDeactivateComponent ? component.canDeactivateComponent() : true;
    }
}

export interface CanDeactivateComponent {
    canDeactivateComponent(): Observable<boolean>;
}

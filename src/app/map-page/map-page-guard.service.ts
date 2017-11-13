import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../service/user.service';
import { ModelService } from '../service/model.service';

@Injectable()
export class MapPageGuardService implements CanActivate, CanDeactivate<CanDeactivateComponent> {

    constructor(private userSvc: UserService, private modelSvc: ModelService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (route.data.requireLogin) {
            if (route.data.requireWritePerm) {
                const mapId = route.params.mapId === 'new' ? -1 : Number.parseInt(route.params.mapId);
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

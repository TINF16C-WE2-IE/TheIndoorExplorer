import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
    // defaults copied from @angular/router/@angular/router.js : class DefaultRouteReuseStrategy

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        return null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
        // default: return future.routeConfig === current.routeConfig;
        return future.routeConfig === current.routeConfig;
    }

}

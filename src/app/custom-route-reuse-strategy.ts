import { ActivatedRouteSnapshot, RouteReuseStrategy } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
    // defaults copied from @angular/router/@angular/router.js : class DefaultRouteReuseStrategy

    shouldDetach(route) {
        return false;
    }

    store(route, detachedTree) {
    }

    shouldAttach(route) {
        return false;
    }

    retrieve(route) {
        return null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
        // default: return future.routeConfig === current.routeConfig;
        return future.routeConfig === current.routeConfig;
    }

}

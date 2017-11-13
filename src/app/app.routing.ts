import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { MapPageComponent } from './map-page/map-page.component';
import { MapPageGuardService } from './map-page/map-page-guard.service';
import { MapPageResolverService } from './map-page/map-page-resolver.service';

export const routes: Routes = [

    {
        path: '',
        component: MainPageComponent,
        pathMatch: 'full'
    },
    {
        path: 'map/:mapId',
        children: [
            {
                path: '',
                component: MapPageComponent,
                pathMatch: 'full',
                canActivate: [MapPageGuardService],
                canDeactivate: [MapPageGuardService],
                resolve: {resolved: MapPageResolverService}
            },
            {
                path: 'edit',
                component: MapPageComponent,
                pathMatch: 'full',
                canActivate: [MapPageGuardService],
                canDeactivate: [MapPageGuardService],
                resolve: {resolved: MapPageResolverService},
                data: {requireLogin: true, requireWritePerm: true}
            },
            {
                path: '**',
                redirectTo: ''
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];


export const routing = RouterModule.forRoot(routes);

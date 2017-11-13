import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { MapPageComponent } from './map-page/map-page.component';

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
                pathMatch: 'full'
            },
            {
                path: 'edit',
                component: MapPageComponent,
                pathMatch: 'full'
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

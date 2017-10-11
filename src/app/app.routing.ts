
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './cmp/home.component';
import { MapsComponent } from './cmp/maps.component';
import { SvgEditComponent } from './svg-edit/svg-edit.component';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'maps',
        component: MapsComponent,
    },
    {
        path: 'editor/:mapId',
        component: SvgEditComponent,
    },
];


export const routing = RouterModule.forRoot(routes);

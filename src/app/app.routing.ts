import {RouterModule, Routes} from '@angular/router';


import {SvgEditComponent} from './svg-edit/svg-edit.component';
import {MainComponent} from './main/main.component';

export const routes: Routes = [

    {
        path: '',
        component: MainComponent,
        pathMatch: 'full'
    },
    {
        path: 'editor/:mapId',
        component: SvgEditComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];


export const routing = RouterModule.forRoot(routes);

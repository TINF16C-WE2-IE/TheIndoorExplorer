
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
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
        path: 'editor',
        component: SvgEditComponent,
    },
];


export const routing = RouterModule.forRoot(routes);

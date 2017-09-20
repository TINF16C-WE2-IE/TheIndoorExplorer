import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routing } from './app.routing';

import {AppComponent} from './app.component';
import {SvgEditComponent} from './svg-edit/svg-edit.component';
import { LoginComponent } from './login/login.component';
import { UpdatesComponent } from './updates/updates.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        AppComponent,
        SvgEditComponent, LoginComponent, UpdatesComponent, FooterComponent, HomeComponent
    ],
    imports: [
        BrowserModule, routing
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

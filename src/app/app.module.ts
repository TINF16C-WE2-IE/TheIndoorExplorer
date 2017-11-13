import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { MainPageComponent } from './main-page/main-page.component';
import { MapListComponent } from './main-page/map-list.component';
import { DeleteMapDialogComponent } from './map-page/dialogs/delete-map-dialog.component';
import { MapnameDialogComponent } from './map-page/dialogs/mapname-dialog.component';
import { PublishMapDialogComponent } from './map-page/dialogs/publish-map-dialog.component';
import { MapPageComponent } from './map-page/map-page.component';
import { FloorControlsComponent } from './map-page/subcomponents/floor-controls.component';
import { SidePropertiesComponent } from './map-page/subcomponents/side-properties.component';
import { SideSearchComponent } from './map-page/subcomponents/side-search.component';
import { SideToolsComponent } from './map-page/subcomponents/side-tools.component';
import { SvgComponent } from './map-page/subcomponents/svg.component';
import { TypeNamePipe } from './map-page/subcomponents/type-name.pipe';
import { MessageService } from './service/message.service';
import { ModelService } from './service/model.service';

import { RequestService } from './service/request.service';
import { ToolService } from './service/tool.service';
import { UserService } from './service/user.service';
import { ToolbarComponent } from './toolbar/toolbar.component';

export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any>{
        'pinch': {enable: true}
    };
}

@NgModule({
    declarations: [
        AppComponent,

        MainPageComponent,
        MapListComponent,

        MapPageComponent,

        MapnameDialogComponent,
        DeleteMapDialogComponent,
        DeleteMapDialogComponent,
        PublishMapDialogComponent,

        FloorControlsComponent,
        SvgComponent,
        SideSearchComponent,
        SideToolsComponent,
        SidePropertiesComponent,

        ToolbarComponent,

        TypeNamePipe
    ],
    entryComponents: [
        DeleteMapDialogComponent,
        MapnameDialogComponent,
        PublishMapDialogComponent
    ],
    imports: [
        BrowserModule, FormsModule, HttpModule, routing, BrowserAnimationsModule, MatAutocompleteModule,
        MatButtonModule, MatButtonToggleModule, MatCardModule, MatDialogModule, MatMenuModule, MatToolbarModule,
        MatIconModule, MatSliderModule, MatSidenavModule,
        MatSlideToggleModule, MatListModule, MatGridListModule, MatFormFieldModule,
        MatInputModule, MatProgressSpinnerModule, MatTableModule, MatTooltipModule, MatSnackBarModule, MatRadioModule,
        FlexLayoutModule, MatSelectModule
    ],
    providers: [
        Location,
        RequestService,
        ModelService,
        MessageService,
        UserService,
        ToolService,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        // {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
        {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

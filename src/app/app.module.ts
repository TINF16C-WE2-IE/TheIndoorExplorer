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
import { RouteReuseStrategy } from '@angular/router';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { MainComponent } from './main/main.component';
import { MapListComponent } from './main/map-list.component';
import { MessageService } from './svc/message.service';
import { ModelService } from './svc/model.service';

import { RequestService } from './svc/request.service';
import { DeleteMapDialogComponent } from './svg-edit/dialogs/delete-map-dialog.component';
import { MapnameDialogComponent } from './svg-edit/dialogs/mapname-dialog.component';
import { PublishMapDialogComponent } from './svg-edit/dialogs/publish-map-dialog.component';
import { SvgEditComponent } from './svg-edit/svg-edit.component';
import { ToolbarComponent } from './svg-edit/toolbar.component';
import { TypeNamePipe } from './svg-edit/type-name.pipe';

export class MyHammerConfig extends HammerGestureConfig {
    overrides = <any>{
        'pinch': {enable: true}
    };
}

@NgModule({
    declarations: [
        AppComponent,
        SvgEditComponent,
        MapListComponent,
        MainComponent,
        ToolbarComponent,
        MapnameDialogComponent,
        DeleteMapDialogComponent,
        TypeNamePipe,
        DeleteMapDialogComponent,
        PublishMapDialogComponent
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
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
        {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

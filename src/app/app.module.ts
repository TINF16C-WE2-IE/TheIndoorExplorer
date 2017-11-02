import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HashLocationStrategy, Location, LocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { SvgEditComponent } from './svg-edit/svg-edit.component';
import { UpdatesComponent } from './cmp/updates.component';
import { FooterComponent } from './cmp/footer.component';

import { RequestService } from './svc/request.service';
import { ModelService } from './svc/model.service';
import { MessageService } from './svc/message.service';
// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatListModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatRadioModule
} from '@angular/material';
import { MapListComponent } from './home/map-list.component';
import {MainComponent} from './home/main.component';

@NgModule({
    declarations: [
        AppComponent,
        SvgEditComponent,
        UpdatesComponent, FooterComponent, MapListComponent, MainComponent
    ],
    imports: [
        BrowserModule, FormsModule, HttpModule, routing, BrowserAnimationsModule,
        MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule, MatSliderModule,
        MatSlideToggleModule, MatListModule, MatGridListModule, MatFormFieldModule,
        MatInputModule, MatProgressSpinnerModule, MatTableModule, MatTooltipModule, MatSnackBarModule, MatRadioModule,
        FlexLayoutModule
    ],
    providers: [
        Location, {provide: LocationStrategy, useClass: HashLocationStrategy}, RequestService, ModelService,
        MessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

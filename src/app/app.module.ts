
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { routing } from './app.routing';

import { AppComponent } from './app.component';
import { SvgEditComponent } from './svg-edit/svg-edit.component';
import { LoginComponent } from './login/login.component';
import { UpdatesComponent } from './updates/updates.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';

//Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdSliderModule,
          MdSlideToggleModule, MdGridListModule, MdFormFieldModule, MdInputModule, MdProgressSpinnerModule } from '@angular/material';

@NgModule({
  declarations: [
      AppComponent,
      SvgEditComponent, LoginComponent, UpdatesComponent, FooterComponent, HomeComponent
  ],
  imports: [
      BrowserModule, FormsModule, HttpModule, routing,
      BrowserAnimationsModule, MdButtonModule, MdMenuModule, MdCardModule, MdToolbarModule, MdIconModule,
      MdSliderModule, MdSlideToggleModule, MdGridListModule, MdFormFieldModule, MdInputModule, MdProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

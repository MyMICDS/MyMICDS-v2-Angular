import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { GridsterModule } from 'angular2gridster';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { HomeComponent } from "./home/home.component";
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home.routing';



@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    GridsterModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas, far, fab);
  }
}

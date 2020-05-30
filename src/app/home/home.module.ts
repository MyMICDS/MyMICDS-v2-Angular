import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyMICDS, MyMICDSModule, MyMICDSModuleType } from '@mymicds/sdk';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';

import { HomeComponent } from "./home/home.component";

import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home.routing';

import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FontAwesomeModule
  ]
})
export class HomeModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas, far, fab);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { PlannerComponent } from './planner/planner.component';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { SharedModule } from '../shared/shared.module';

import { PlannerRoutingModule } from './planner.routing';

@NgModule({
  declarations: [
    PlannerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PlannerRoutingModule,
    FormsModule,
    BrowserModule,
    ColorPickerModule,
    FontAwesomeModule
  ],
  providers: [
    ColorPickerService
  ]
})
export class PlannerModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas, far, fab);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { ModuleOptionsComponent } from './module-options/module-options.component';
import { ModuleContainerComponent } from './module-container/module-container.component';
import { ModuleOptionComponent } from './module-options/module-option/module-option.component';

@NgModule({
  declarations: [
    ModuleOptionsComponent,
    ModuleContainerComponent,
    ModuleOptionComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas, far, fab);
  }
}

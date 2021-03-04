import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { LunchComponent } from './lunch/lunch.component';

import { SharedModule } from '../shared/shared.module';

import { LunchRoutingModule } from './lunch.routing';

@NgModule({
	declarations: [LunchComponent],
	imports: [CommonModule, SharedModule, LunchRoutingModule, FontAwesomeModule]
})
export class LunchModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, fab);
	}
}

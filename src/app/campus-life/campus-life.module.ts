import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { SlideshowModule } from 'ng-simple-slideshow';

import { CampusComponent } from './campus/campus.component';

import { SharedModule } from '../shared/shared.module';
import { CampusLifeRoutingModule } from './campus-life.routing';

@NgModule({
	declarations: [
		CampusComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		CampusLifeRoutingModule,
		FontAwesomeModule,
		FormsModule,
		SlideshowModule
	]
})
export class CampusLifeModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, far, fab);
	}
}

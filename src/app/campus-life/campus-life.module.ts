import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { fab } from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { SlideshowModule } from 'ng-simple-slideshow';

import { CampusComponent } from './campus/campus.component';

import { CampusLifeRoutingModule } from './campus-life.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [CampusComponent],
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
		library.addIconPacks(fas, fab);
	}
}

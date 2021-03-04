import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { fab } from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { AboutComponent } from './about/about.component';
import { SuggestionsComponent } from './suggestions/suggestions.component';

import { AboutRoutingModule } from './about.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [AboutComponent, SuggestionsComponent],
	imports: [CommonModule, SharedModule, AboutRoutingModule, FontAwesomeModule]
})
export class AboutModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, fab);
	}
}

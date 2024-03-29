import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { fab } from '@fortawesome/free-brands-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { BulletinArchivesComponent } from './bulletin-archives/bulletin-archives.component';
import { DailyBulletinComponent } from './daily-bulletin/daily-bulletin.component';

import { DailybulletinRoutingModule } from './daily-bulletin.routing';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [DailyBulletinComponent, BulletinArchivesComponent],
	imports: [CommonModule, SharedModule, DailybulletinRoutingModule, FontAwesomeModule]
})
export class DailyBulletinModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, fab);
	}
}

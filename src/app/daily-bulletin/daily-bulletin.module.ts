import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { DailyBulletinComponent } from './daily-bulletin/daily-bulletin.component';
import { BulletinArchivesComponent } from './bulletin-archives/bulletin-archives.component';

import { SharedModule } from '../shared/shared.module';
import { DailybulletinRoutingModule } from './daily-bulletin.routing';

@NgModule({
	declarations: [
		DailyBulletinComponent,
		BulletinArchivesComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		DailybulletinRoutingModule,
		FontAwesomeModule,
		BsDatepickerModule,
		PdfViewerModule
	]
})
export class DailyBulletinModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, fab);
	}
}

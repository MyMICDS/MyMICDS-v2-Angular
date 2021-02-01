import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';
import { PlannerComponent } from './planner/planner.component';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
	BsDropdownModule,
	DatepickerModule,
	ModalModule,
	TimepickerModule
} from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


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
		ColorPickerModule,
		FontAwesomeModule,
		NgbModule,
		BsDropdownModule.forRoot(),
		DatepickerModule.forRoot(),
		ModalModule.forRoot(),
		TimepickerModule.forRoot(),
		BsDatepickerModule.forRoot()
	],
	providers: [
		ColorPickerService
	]
})
export class PlannerModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, fab);
	}
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { GridsterModule } from 'angular2gridster';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { AngularFittextModule } from 'angular-fittext';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconPickerModule } from 'ngx-icon-picker';

import { BookmarksComponent } from './modules/bookmarks/bookmarks.component';
import { CountdownComponent } from './modules/countdown/countdown.component';
import { GpaCalculatorComponent } from './modules/gpa-calculator/gpa-calculator.component';
import { ProgressComponent } from './modules/progress/progress.component';
import { ScheduleComponent } from './modules/schedule/schedule.component';
import { SimplifiedScheduleComponent } from './modules/simplified-schedule/simplified-schedule.component';
import { SnowdayComponent } from './modules/snowday/snowday.component';
import { StickynotesComponent } from './modules/stickynotes/stickynotes.component';
import { SimplifiedLunchComponent } from './modules/simplified-lunch/simplified-lunch.component';
import { TwitterComponent } from './modules/twitter/twitter.component';
import { WeatherComponent } from './modules/weather/weather.component';

import { ModuleOptionsComponent } from './module-options/module-options.component';

import { ModuleOptionComponent } from './module-options/module-option/module-option.component';
import { ModuleInspectorComponent } from './module-inspector/module-inspector.component';
import { moduleComponents } from './modules/module-config';

import { HomeComponent } from './home/home.component';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home.routing';


@NgModule({
	declarations: [
		HomeComponent,
		ModuleOptionsComponent,
		ModuleOptionComponent,
		moduleComponents,
		BookmarksComponent,
		CountdownComponent,
		GpaCalculatorComponent,
		ProgressComponent,
		ScheduleComponent,
		SimplifiedScheduleComponent,
		StickynotesComponent,
		SnowdayComponent,
		SimplifiedLunchComponent,
		TwitterComponent,
		WeatherComponent,
		ModuleInspectorComponent,
	],
	entryComponents: moduleComponents,
	imports: [
		CommonModule,
		FontAwesomeModule,
		GridsterModule.forRoot(),
		IconPickerModule,
		HomeRoutingModule,
		SharedModule,
		FormsModule,
		AngularFittextModule,
		NgbModule
	],
	exports: [
		ModuleInspectorComponent,
	]
})
export class HomeModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, fab);
	}
}

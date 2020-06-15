import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { ModalModule } from 'ngx-bootstrap';
import { ColorPickerModule, ColorPickerService } from 'ngx-color-picker';

import { AliasesComponent } from './settings/aliases/aliases.component';
import { BackgroundComponent } from './settings/background/background.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ClassesComponent } from './settings/classes/classes.component';
import { InfoComponent } from './settings/info/info.component';
import { UrlComponent } from './settings/url/url.component';
import { SettingsComponent } from './settings/settings.component';
import { HelpComponent } from './help/help.component';
import { AlertService } from '../services/alert.service';
import { BackgroundService } from '../services/background.service';

import { SettingsRoutingModule } from './settings.routing';
import { SharedModule } from '../shared/shared.module';


@NgModule({
	declarations: [
		HelpComponent,
		SettingsComponent,
		InfoComponent,
		ClassesComponent,
		ChangePasswordComponent,
		BackgroundComponent,
		AliasesComponent,
		UrlComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		FormsModule,
		ColorPickerModule,
		FontAwesomeModule,
		ModalModule.forRoot(),
		ReactiveFormsModule,
		RouterModule,
		SettingsRoutingModule
	],
	providers: [
		AlertService,
		BackgroundService,
		ColorPickerService
	]
})
export class SettingsModule {
	constructor(library: FaIconLibrary) {
		// Add an icon to the library for convenient access in other components
		library.addIconPacks(fas, far, fab);
	}
}

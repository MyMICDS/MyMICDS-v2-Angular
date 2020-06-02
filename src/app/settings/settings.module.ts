import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';;
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';


import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {
	BsDropdownModule,
	DatepickerModule,
	ModalModule,
	PopoverModule,
	TimepickerModule,
	TooltipModule
} from 'ngx-bootstrap';

import { SettingsComponent } from './settings/settings.component';
import { HelpComponent } from './help/help.component';

import { AliasesComponent } from './settings/aliases/aliases.component';
import { BackgroundComponent } from './settings/background/background.component';
import { ChangePasswordComponent } from './settings/change-password/change-password.component';
import { ClassesComponent } from './settings/classes/classes.component';
import { InfoComponent } from './settings/info/info.component';
import { UrlComponent } from './settings/url/url.component';

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
    BrowserModule,
    BsDatepickerModule,
    FontAwesomeModule,
    BsDropdownModule,
  	DatepickerModule,
  	ModalModule,
  	PopoverModule,
  	TimepickerModule,
  	TooltipModule,
		ReactiveFormsModule,
		RouterModule
  ]
})
export class SettingsModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas, far, fab);
  }
}
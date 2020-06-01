import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

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
    BrowserModule
  ]
})
export class SettingsModule { }

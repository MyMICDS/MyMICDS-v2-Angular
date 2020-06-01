import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { AuthGuard } from '../common/auth.guard';
import { CanDeactivateGuard } from '../common/canDeactivate.guard';

import { SettingsComponent } from './settings/settings.component';
import { HelpComponent } from './help/help.component';
// import { AliasesComponent } from './settings/aliases/aliases.component';
// import { BackgroundComponent } from './settings/background/background.component';
// import { ChangePasswordComponent } from './settings/change-password/change-password.component';
// import { ClassesComponent } from './settings/classes/classes.component';
// import { InfoComponent } from './settings/info/info.component';
// import { UrlComponent } from './settings/url/url.component';

const settingsRoutes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'help',
    component: HelpComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(settingsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SettingsRoutingModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas, far, fab);
  }
}

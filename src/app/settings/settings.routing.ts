import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../common/auth.guard';
import { CanDeactivateGuard } from '../common/canDeactivate.guard';

import { HelpComponent } from './help/help.component';
import { SettingsComponent } from './settings/settings.component';
// import { AliasesComponent } from './settings/aliases/aliases.component';
// import { BackgroundComponent } from './settings/background/background.component';
// import { ChangePasswordComponent } from './settings/change-password/change-password.component';
// import { ClassesComponent } from './settings/classes/classes.component';
// import { InfoComponent } from './settings/info/info.component';
// import { UrlComponent } from './settings/url/url.component';

const settingsRoutes: Routes = [
	{
		path: '',
		component: SettingsComponent,
		canActivate: [AuthGuard],
		canDeactivate: [CanDeactivateGuard]
	},
	{
		path: 'help',
		component: HelpComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(settingsRoutes)],
	exports: [RouterModule]
})
export class SettingsRoutingModule {}

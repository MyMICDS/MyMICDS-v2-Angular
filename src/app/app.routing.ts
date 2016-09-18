import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {HomeComponent} from './components/home/home.component';
import {LunchComponent} from './components/lunch/lunch.component';
import {PlannerComponent} from './components/planner/planner.component';
import {DailyBulletinComponent} from './components/daily-bulletin/daily-bulletin.component';
import {BulletinArchivesComponent} from './components/bulletin-archives/bulletin-archives.component';
import {SettingsComponent} from './components/settings/settings.component';
import {AboutComponent} from './components/about/about.component';
import {HelpComponent} from './components/help/help.component';
import {LoginComponent} from './components/login/login.component';
import {LogoutComponent} from './components/logout/logout.component';
import {RegisterComponent} from './components/register/register.component';
import {ConfirmComponent} from './components/confirm/confirm.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';

import {AuthGuard} from './common/auth.guard';
import {CanDeactivateGuard} from './common/canDeactivate.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/home',
		pathMatch: 'full'
	},
	{
		path: 'home',
		component: HomeComponent,
		data: {
			title: 'MyMICDS - Home'
		}
	},
	{
		path: 'lunch',
		component: LunchComponent
	},
	{
		path: 'planner/:year/:month',
		component: PlannerComponent,
	},
	{
		path: 'planner',
		component: PlannerComponent
	},
	{
		path: 'daily-bulletin',
		component: DailyBulletinComponent
	},
	{
		path: 'daily-bulletin/:bulletin',
		component: DailyBulletinComponent
	},
	{
		path: 'bulletin-archives',
		component: BulletinArchivesComponent
	},
	{
		path: 'settings',
		component: SettingsComponent,
		canActivate: [AuthGuard],
		canDeactivate: [CanDeactivateGuard]
	},
	{
		path: 'about',
		component: AboutComponent
	},
	{
		path: 'help',
		component: HelpComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'logout',
		component: LogoutComponent
	},
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: 'confirm/:user/:hash',
		component: ConfirmComponent
	},
	{
		path: 'forgot-password',
		component: ForgotPasswordComponent
	},
	{
		path: 'reset-password/:user/:hash',
		component: ResetPasswordComponent
	}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
export const appRoutingProviders = [AuthGuard, CanDeactivateGuard]
